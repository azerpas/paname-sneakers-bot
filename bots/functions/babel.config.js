module.exports = {
    presets: [
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        "module-resolver",
        {
          "root": ["./"],
          "alias": {
            "@src": "./src",
            "@bots": "./src/bots",
            "@capsolvers": "./src/capsolvers"
          },
          "extensions": [".js", ".jsx", ".es", ".es6", ".mjs",".ts"]
        }
      ]
    ]
};