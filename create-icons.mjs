import { writeFileSync } from 'fs'

const svg192 = `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#185FA5"/>
  <rect x="32" y="56" width="128" height="12" rx="6" fill="white" opacity="0.3"/>
  <rect x="32" y="80" width="100" height="8" rx="4" fill="white" opacity="0.2"/>
  <circle cx="96" cy="110" r="32" fill="white" opacity="0.15"/>
  <circle cx="96" cy="110" r="20" fill="white" opacity="0.2"/>
  <rect x="90" y="96" width="12" height="28" rx="6" fill="white"/>
  <rect x="82" y="118" width="28" height="8" rx="4" fill="white"/>
  <rect x="93" y="126" width="6" height="10" rx="3" fill="white"/>
  <text x="96" y="158" font-family="Arial" font-size="18" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">NotaClínica</text>
</svg>`

const svg512 = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#185FA5"/>
  <rect x="80" y="140" width="352" height="32" rx="16" fill="white" opacity="0.3"/>
  <rect x="80" y="200" width="280" height="22" rx="11" fill="white" opacity="0.2"/>
  <circle cx="256" cy="300" r="88" fill="white" opacity="0.15"/>
  <circle cx="256" cy="300" r="56" fill="white" opacity="0.2"/>
  <rect x="238" y="262" width="36" height="76" rx="18" fill="white"/>
  <rect x="214" y="322" width="76" height="22" rx="11" fill="white"/>
  <rect x="245" y="344" width="22" height="28" rx="11" fill="white"/>
  <text x="256" y="440" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">NotaClínica</text>
</svg>`

writeFileSync('public/icon-192.svg', svg192)
writeFileSync('public/icon-512.svg', svg512)
console.log('SVG icons created')
