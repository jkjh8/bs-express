module.exports = {
  presets: ['@babel/preset-env'],
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          'transform-remove-console',
          '@babel/plugin-transform-runtime',
          ['module-resolver', { alias: { '@': './src' } }]
        ]
      : [
          '@babel/plugin-transform-runtime',
          ['module-resolver', { alias: { '@': './src' } }]
        ],
  ignore: ['./src/public/**/*.js']
}
