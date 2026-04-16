// Approximate minified + gzipped sizes in KB for common packages
export const BUNDLE_SIZE_MAP = {
  react: 2.5,
  'react-dom': 36,
  'react-router-dom': 21,
  'react-router': 18,
  vue: 22,
  angular: 62,
  'next': 90,
  nuxt: 95,
  axios: 12,
  lodash: 24,
  'lodash-es': 23,
  moment: 72,
  dayjs: 2.8,
  'date-fns': 18,
  jquery: 30,
  redux: 5.1,
  'react-redux': 8,
  'zustand': 1.1,
  'recoil': 21,
  jotai: 3.5,
  mobx: 17,
  'mobx-react': 4,
  'styled-components': 16,
  '@emotion/react': 11,
  '@emotion/styled': 7,
  tailwindcss: 0.3,
  '@mui/material': 94,
  '@mui/icons-material': 18,
  antd: 78,
  'chakra-ui': 32,
  '@chakra-ui/react': 32,
  'framer-motion': 43,
  'react-spring': 25,
  gsap: 27,
  'three': 162,
  'd3': 51,
  'chart.js': 40,
  'recharts': 37,
  'victory': 52,
  '@tanstack/react-query': 12,
  'react-query': 12,
  swr: 4.5,
  'apollo-client': 31,
  '@apollo/client': 35,
  graphql: 14,
  'socket.io-client': 44,
  'ws': 9,
  'uuid': 1.1,
  'nanoid': 0.5,
  'classnames': 0.4,
  clsx: 0.3,
  immer: 6.5,
  '@reduxjs/toolkit': 18,
  'formik': 13,
  'react-hook-form': 9,
  'yup': 12,
  'zod': 14,
  'vite': 0.1,
  'webpack': 0.1,
  'typescript': 0.1,
  'eslint': 0.1,
  'prettier': 0.1,
  'jest': 0.1,
  'vitest': 0.1,
  '@testing-library/react': 8,
  'cypress': 0.1,
  'playwright': 0.1,
  'express': 14,
  'fastify': 16,
  'koa': 6,
  'hapi': 28,
  'mongoose': 53,
  'sequelize': 48,
  'typeorm': 42,
  'prisma': 2,
  'knex': 21,
  'dotenv': 0.6,
  'cors': 0.5,
  'helmet': 1.2,
  'bcrypt': 3,
  'bcryptjs': 3,
  'jsonwebtoken': 12,
  'passport': 4,
  'nodemailer': 19,
}

const DEFAULT_SIZE_KB = 15

export function estimateBundleSize(deps) {
  let total = 0
  const breakdown = []

  for (const name of Object.keys(deps)) {
    const size = BUNDLE_SIZE_MAP[name] ?? DEFAULT_SIZE_KB
    total += size
    breakdown.push({ name, size, isEstimated: !BUNDLE_SIZE_MAP[name] })
  }

  breakdown.sort((a, b) => b.size - a.size)

  return { totalKb: total, breakdown }
}

export function formatSize(kb) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`
  if (kb >= 1) return `${kb.toFixed(1)} KB`
  return `${(kb * 1024).toFixed(0)} B`
}

export function getSizeLevel(totalKb) {
  if (totalKb < 100) return 'light'
  if (totalKb < 350) return 'moderate'
  if (totalKb < 700) return 'heavy'
  return 'very-heavy'
}
