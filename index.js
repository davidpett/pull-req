#!/usr/bin/env node

var cmd = require('node-cmd')

cmd.get('git remote get-url origin', function (err, data, stderr) {
  if (data && data !== '') {
    var remoteUrl = data.split('.git')[0]
    cmd.get('git rev-parse --abbrev-ref HEAD', function(err, data, stderr) {
      if (data && data !== '') {
        var branch = data
        
        if (remoteUrl.indexOf('git@') === 0) {
          remoteUrl = remoteUrl.replace(':', '/')
          remoteUrl = remoteUrl.replace('git@', 'https://')
        }
        if (remoteUrl.indexOf('github.com') > -1) {
          remoteUrl = remoteUrl + '/compare/' + branch
        }
        if (remoteUrl.indexOf('gitlab.com') > -1) {
          remoteUrl = remoteUrl + '/merge_requests/new?merge_request%5Bsource_branch%5D=' + branch
        }
        if (remoteUrl.indexOf('bitbucket.org') > -1) {
          remoteUrl = remoteUrl + '/pull-requests/new?source=' + branch + '&t=1'
        }
        cmd.run('open ' + remoteUrl)

        console.log('pull request url: ' + remoteUrl)
      }
    })
  } else {
    console.log('Not a git repository')
  }
})
