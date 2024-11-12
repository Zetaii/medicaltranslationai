import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
          plugins: [["@babel/plugin-transform-runtime", { regenerator: true }]],
        },
      },
    })
    return config
  },
}

export default nextConfig
