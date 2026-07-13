#!/usr/bin/env bash
set -euo pipefail

release_id=${1:-}
archive=${2:-}
deploy_root=${3:-}
deploy_base=${4:-}
service_name=${5:-}
healthcheck_url=${6:-}

[[ "$release_id" =~ ^[0-9a-f]{40}$ ]] || { echo "Invalid release id" >&2; exit 2; }
path_pattern='^/[A-Za-z0-9._/-]+$'
[[ "$deploy_base" =~ $path_pattern ]] && [[ "$deploy_base" != "/" ]] || { echo "Invalid deploy base" >&2; exit 2; }
[[ "$deploy_root" =~ $path_pattern ]] && [[ "$deploy_root" == "$deploy_base/"* ]] || { echo "Invalid deploy root" >&2; exit 2; }
[[ "$(realpath -m "$deploy_base")" == "$deploy_base" && "$(realpath -m "$deploy_root")" == "$deploy_root" ]] || { echo "Deployment paths must be canonical" >&2; exit 2; }
[[ "$service_name" =~ ^[A-Za-z0-9@._-]+$ ]] || { echo "Invalid service name" >&2; exit 2; }
[[ "$archive" == "$deploy_root/incoming/fdi-frontend-$release_id.tgz" ]] || { echo "Unexpected archive path" >&2; exit 2; }
[[ "$healthcheck_url" =~ ^https?:// ]] || { echo "Invalid healthcheck URL" >&2; exit 2; }
[[ -f "$archive" ]] || { echo "Release archive is missing" >&2; exit 2; }

releases="$deploy_root/releases"
release_dir="$releases/$release_id"
current_link="$deploy_root/current"
lock_dir="$deploy_root/.activate-lock"
mkdir -p "$releases"
mkdir "$lock_dir" 2>/dev/null || { echo "Another activation is running" >&2; exit 3; }
trap 'rm -rf -- "$lock_dir"' EXIT

previous_target=""
[[ -L "$current_link" ]] && previous_target=$(readlink -f "$current_link")
if [[ ! -d "$release_dir" ]]; then
  rm -rf -- "$release_dir.tmp"
  mkdir "$release_dir.tmp"
  tar -xzf "$archive" -C "$release_dir.tmp"
  mv "$release_dir.tmp" "$release_dir"
fi
ln -sfn "$release_dir" "$current_link.next"
mv -Tf "$current_link.next" "$current_link"

if ! systemctl --user restart "$service_name" || ! curl --fail --silent --show-error --retry 5 --retry-delay 2 "$healthcheck_url" >/dev/null; then
  if [[ -n "$previous_target" && -d "$previous_target" ]]; then
    ln -sfn "$previous_target" "$current_link.rollback"
    mv -Tf "$current_link.rollback" "$current_link"
    systemctl --user restart "$service_name" || true
  else
    rm -f -- "$current_link"
    systemctl --user stop "$service_name" || true
  fi
  echo "Activation failed; previous release restored" >&2
  exit 4
fi

rm -f -- "$archive"
active_target=$(readlink -f "$current_link")
mapfile -t stale < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | tail -n +6 | cut -d' ' -f2-)
for directory in "${stale[@]}"; do
  [[ "$directory" == "$active_target" ]] || rm -rf -- "$directory"
done

echo "Activated release $release_id"
