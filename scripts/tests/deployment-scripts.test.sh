#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "$0")/../.." && pwd)
sandbox=$(mktemp -d)
trap 'rm -rf -- "$sandbox"' EXIT
deploy_base="$sandbox/deployments"
deploy_root="$deploy_base/fdi"
mock_bin="$sandbox/bin"
mkdir -p "$deploy_root/incoming" "$mock_bin"

cat > "$mock_bin/systemctl" <<'EOF'
#!/usr/bin/env bash
exit "${SYSTEMCTL_EXIT:-0}"
EOF
cat > "$mock_bin/curl" <<'EOF'
#!/usr/bin/env bash
exit "${CURL_EXIT:-0}"
EOF
chmod +x "$mock_bin/systemctl" "$mock_bin/curl"

make_archive() {
  local id=$1 source="$sandbox/source-$1"
  mkdir -p "$source"
  printf '%s\n' "$id" > "$source/server.js"
  tar -czf "$deploy_root/incoming/fdi-frontend-$id.tgz" -C "$source" .
}

activate() {
  local id=$1
  PATH="$mock_bin:$PATH" bash "$repo_root/scripts/activate-release.sh" "$id" "$deploy_root/incoming/fdi-frontend-$id.tgz" "$deploy_root" "$deploy_base" fdi.service http://127.0.0.1:3000/
}

first=1111111111111111111111111111111111111111
second=2222222222222222222222222222222222222222

make_archive "$first"
if CURL_EXIT=1 activate "$first"; then
  echo "First activation unexpectedly succeeded" >&2
  exit 1
fi
[[ ! -e "$deploy_root/current" ]]

make_archive "$first"
activate "$first"
[[ "$(readlink -f "$deploy_root/current")" == "$deploy_root/releases/$first" ]]

make_archive "$second"
activate "$second"
[[ "$(readlink -f "$deploy_root/current")" == "$deploy_root/releases/$second" ]]

if PATH="$mock_bin:$PATH" CURL_EXIT=1 bash "$repo_root/scripts/rollback-release.sh" "$deploy_root" "$deploy_base" fdi.service http://127.0.0.1:3000/ "$first"; then
  echo "Unhealthy rollback unexpectedly succeeded" >&2
  exit 1
fi
[[ "$(readlink -f "$deploy_root/current")" == "$deploy_root/releases/$second" ]]

mkdir "$deploy_root/.activate-lock"
if PATH="$mock_bin:$PATH" bash "$repo_root/scripts/rollback-release.sh" "$deploy_root" "$deploy_base" fdi.service http://127.0.0.1:3000/ "$first"; then
  echo "Locked rollback unexpectedly succeeded" >&2
  exit 1
fi

if PATH="$mock_bin:$PATH" bash "$repo_root/scripts/activate-release.sh" "$first" "$deploy_base/../escape/incoming/fdi-frontend-$first.tgz" "$deploy_base/../escape" "$deploy_base" fdi.service http://127.0.0.1:3000/; then
  echo "Traversal path unexpectedly succeeded" >&2
  exit 1
fi

echo "Deployment script tests passed."
