#!/bin/bash
# Deploy the Cloudflare Worker failover for portfolio.mr-romero.com
#
# PREREQUISITES (do these ONCE in Cloudflare dashboard):
# 1. Create API token at https://dash.cloudflare.com/profile/api-tokens
#    - Template: "Edit Cloudflare Workers"
#    - Zone: mr-romero.com
# 2. In Zero Trust > Networks > Tunnels, add a public hostname:
#    - origin-portfolio.mr-romero.com -> http://localhost:9009
#    (This lets the worker reach the origin without looping)
# 3. In DNS, verify origin-portfolio.mr-romero.com exists (tunnel auto-creates it)
#
# USAGE:
#   CLOUDFLARE_API_TOKEN=your-token ./deploy.sh

set -e

cd "$(dirname "$0")"

echo "Deploying portfolio-failover worker..."
npx wrangler deploy

echo ""
echo "Worker deployed! Now:"
echo "1. Go to Cloudflare Dashboard > Workers & Pages > portfolio-failover"
echo "2. Under Triggers, verify route is: portfolio.mr-romero.com/*"
echo "3. Test: curl -sI https://portfolio.mr-romero.com | grep X-Served-By"
echo "   Should show 'X-Served-By: origin'"
echo ""
echo "To test failover: stop the PM2 process (pm2 stop edci-portfolio)"
echo "and curl again. Should show 'X-Served-By: cache' or the fallback page."
