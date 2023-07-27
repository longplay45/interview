rm -rf deploy
mkdir deploy
mkdir deploy/public
npm run frontend:build
cp -R frontend/dist/* deploy/public
cp -R backend/* deploy
rm -rf deploy/__pycache__
rm deploy/interview.ini.template
rm deploy/requirements.txt
scp -r /Users/i/Docs/Dev/Data/projects/interview/deploy/* i@artificial-interactions.com:/home/i/www/dev.lp45.net/interview
