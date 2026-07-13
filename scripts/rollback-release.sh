#!/usr/bin/env bash
set -euo pipefail

deploy_root=${1:-}
deploy_base=${2:-}
service_name=${3:-}
healthcheck_url=${4:-}
target_id=${5:-}

path_pattern='^/[A-Za-z0-9._/-]+$'
[[ "$deploy_base" =~ $path_pattern ]] && [[ "$deploy_base" != "/" ]] || { echo "Invalid deploy base" >&2; exit 2; }
[[ "$deploy_root" =~ $path_pattern ]] && [[ "$deploy_root" == "$deploy_base/"* ]] || { echo "Invalid deploy root" >&2; exit 2; }
[[ "$(realpath -m "$deploy_base")" == "$deploy_base" && "$(realpath -m "$deploy_root")" == "$deploy_root" ]] || { echo "Deployment paths must be canonical" >&2; exit 2; }
[[ "$service_name" =~ ^[A-Za-z0-9@._-]+$ ]] || { echo "Invalid service name" >&2; exit 2; }
[[ "$healthcheck_url" =~ ^https?:// ]] || { echo "Invalid healthcheck URL" >&2; exit 2; }

current_link="$deploy_root/current"
current_target=$(readlink -f "$current_link")
[[ -n "$current_target" && -d "$current_target" ]] || { echo "Current release is unavailable" >&2; exit 3; }
lock_dir="$deploy_root/.activate-lock"
mkdir "$lock_dir" 2>/dev/null || { echo "Another activation or rollback is running" >&2; exit 3; }
trap 'rm -rf -- "$lock_dir"' EXIT
if [[ -n "$target_id" ]]; then
  [[ "$target_id" =~ ^[0-9a-f]{40}$ ]] || { echo "Invalid target release" >&2; exit 2; }
  target="$deploy_root/releases/$target_id"
else
  target=$(find "$deploy_root/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2- | grep -Fvx "$current_target" | head -n 1)
fi
[[ -d "$target" ]] || { echo "Rollback release not found" >&2; exit 3; }

ln -sfn "$target" "$current_link.rollback"
mv -Tf "$current_link.rollback" "$current_link"
if ! systemctl --user restart "$service_name" || ! curl --fail --silent --show-error --retry 5 --retry-delay 2 "$healthcheck_url" >/dev/null; then
  ln -sfn "$current_target" "$current_link.failed-rollback"
  mv -Tf "$current_link.failed-rollback" "$current_link"
  systemctl --user restart "$service_name" || true
  echo "Rollback health check failed; original release restored" >&2
  exit 4
fi
echo "Rolled back to $(basename "$target")"
