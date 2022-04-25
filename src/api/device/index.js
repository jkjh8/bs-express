const { PythonShell } = require('python-shell')

let options = {
  mode: 'json',
  args: ['1', '2']
}

PythonShell.run('my_script.py', options, function (err) {
  if (err) throw err
  console.log('finished')
})
