#!/usr/bin/env node

var cmd = require('node-cmd')

cmd.get('git remote get-url origin', function(err, data, stderr) {
  if (data && data !== '') {
    var remoteUrl = data.split('.git')[0]
    cmd.get('git rev-parse --abbrev-ref HEAD', function(err, data, stderr) {
      if (data && data !== '') {
        var branch = data

        console.log('pushing branch ' + branch + ' to origin')
        cmd.get('git push -u origin ' + branch, function() {
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
          if (remoteUrl.indexOf('/stash/') > -1) {
            remoteUrl = remoteUrl + '/pull-requests?create'
          }

          console.log('pull request url: ' + remoteUrl)
          cmd.run('open ' + remoteUrl)
        })
      }
    })
  } else {
    console.log('Not a git repository')
  }
})
