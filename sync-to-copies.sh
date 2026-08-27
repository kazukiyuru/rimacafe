#!/bin/bash
# rimacafe を更新した内容を、コピーを配置している他リポジトリへ反映する。
#
# 背景：rimacafe はスタンドアロンで rimacafe.netlify.app として公開しているが、
# 以下の場所にも同じ内容のコピーを配置しており、そちらは自動更新されない：
#   - self_introduction/rimacafe/   （本サイト kazukitakao.netlify.app 用）
#   - portfolio-design/portfolio-b/rimacafe/  （B案ポートフォリオ用）
#
# 使い方：rimacafe を更新してコミットする前後どちらでもよいので、
# このスクリプトを実行してコピー先に反映する。
#   cd rimacafe && ./sync-to-copies.sh

set -e
cd "$(dirname "$0")"

DESTS=(
  "../self_introduction/rimacafe"
  "../portfolio-design/portfolio-b/rimacafe"
)

for DST in "${DESTS[@]}"; do
  echo "=== $DST ==="
  if [ ! -d "$DST" ]; then
    echo "→ 見つかりません。スキップします。"
    echo ""
    continue
  fi

  DIFF=$(diff -rq . "$DST" --exclude=.git --exclude=README.md --exclude=.claude --exclude=sync-to-copies.sh 2>/dev/null || true)

  if [ -z "$DIFF" ]; then
    echo "→ 差分なし（既に同期済み）"
  else
    echo "→ 差分あり。同期します:"
    echo "$DIFF"
    cp index.html animation.js style.css "$DST/"
    cp img/* "$DST/img/" 2>/dev/null || true
    mkdir -p "$DST/case-study"
    cp -r case-study/. "$DST/case-study/" 2>/dev/null || true
    echo "→ コピー完了。$DST を含むリポジトリで git status を確認し、変更があればコミット・pushしてください。"
  fi
  echo ""
done

echo "=== 完了 ==="
