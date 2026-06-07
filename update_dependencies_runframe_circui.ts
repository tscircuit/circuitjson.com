You are now ready to merge your fix! 🚀
// FILE: .github/workflows/update-package.yml
# =============================================================================
# Do not change anything in this file.
# This workflow automatically updates @tscircuit packages when triggered by
# the source repository's trigger-dependent-repo-update.yml workflow.
# ==============================================================
name: Update @tscircuit Package

on:
  workflow_dispatch:
    inputs:
      package_names:
        description: 'Package names to update (comma-separated, e.g., @tscircuit/core,@tscircuit/props)'
        required: true
        type: string
        default: '@tscircuit/runframe'

env:
  PACKAGE_NAMES: ${{ inputs.package_names }}

jobs:
  update-package:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.TSCIRCUIT_BOT_GITHUB_TOKEN }}
      - uses: oven-sh/setup-bun@v2
      - name: Update packages
        run: |
          IFS=',' read -ra PACKAGES <<< "${{ env.PACKAGE_NAMES }}"
          for package in "${PACKAGES[@]}"; do
            if [[ -n "$package" ]]; then
              bun update --latest "$package"
            fi
          done
      - name: Create Pull Request
--- 
// FILE: src/App.tsx