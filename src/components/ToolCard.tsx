'use client';

import { Lock, ArrowRight, Globe } from 'lucide-react';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  isLoggedIn: boolean;
  onEdit?: (tool: Tool) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const categoryColors: Record<string, { bg: string; gradient: string }> = {
  productivity: { bg: 'bg-blue-50', gradient: 'from-blue-500 to-indigo-600' },
  coding: { bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-600' },
  content: { bg: 'bg-purple-50', gradient: 'from-purple-500 to-pink-600' },
  chat: { bg: 'bg-orange-50', gradient: 'from-orange-500 to-red-600' },
  default: { bg: 'bg-gray-50', gradient: 'from-gray-500 to-gray-600' },
};

// 预定义热门 AI 工具的 SVG 图标（使用 Buffer.from 预编码以支持 Unicode 字符）
const knownToolIcons: Record<string, string> = {
  // ChatGPT
  'chatgpt': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMxMGEzN2YiLz48cGF0aCBkPSJNMzggMjBjLTE2LjUgMC0zMCAxMy41LTMwIDMwczEzLjUgMzAgMzAgMzAgMzAtMTMuNSAzMC0zMC0xMy41LTMwLTMwLTMwem0wIDUwYy0xMSAwLTIwLTktMjAtMjBzOS0yMCAyMC0yMCAyMCA5IDIwIDIwLTkgMjAtMjAgMjB6IiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjQiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iNCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMzggNjBjMCA1LjUgNC41IDEwIDEwIDEwczEwLTQuNSAxMC0xMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=',
  // Claude
  'claude': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMxYTFhMWEiLz48cmVjdCB4PSIyMCIgeT0iMjUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI1MCIgcj0iMTAiIGZpbGw9IiNkNGE1NzQiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI2IiBmaWxsPSIjMWExYTFhIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI1MCIgcj0iNiIgZmlsbD0iIzFhMWExYSIvPjxwYXRoIGQ9Ik00MCA2NXEgMTAgOCAyMCAwIiBzdHJva2U9IiMxYTFhMWEiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
  // Midjourney
  'midjourney': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiM1ODU2ZDYiLz48cGF0aCBkPSJNMzAgNzBMNTAgMzBsMjAgNDBNIDQwIDU1aDIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
  // GitHub
  'github': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMyNDkyOWUiLz48cGF0aCBkPSJNNTUuMjUgMTcuNjVjLTE3Ljc1IDAtMzIuMTI1IDE0LjM3NS0zMi4xMjUgMzIuMTI1IDAgMTQuMTUgOS4yIDE2LjMyNSAyMS45IDE0LjI3NSAxLjYgMC4zIDEuOC0wLjggMS44LTEuNjB2LTVuNzVjLTguOSAyLjAzNS0xMC44LTQuMzI1LTEwLjgtNC4zMjUgMS0xLjU3NSAzLjYtMy4wNzUgMy42LTMuMDc1IDIuOSAtMi4wNzUgLS4yLTEuOTI1LS4yLTEuOTI1IDMuMiAwLjI4NSA0LjkgMy4zMjUgNC45IDMuMzI1IDIuOSAyLjM3NSA3LjUgMy41MSA5LjMgMi43NSAwLjMgLTIuMSAMS4xLTMuNSAyLTIuMyAtNy4xLTAuODI1LTE0LjUgLTMuNjI1LTE0LjUgLTE1LjggMCA0Ljc1IDEuMiA2LjUgMy4zIDguNjI1LTAuMyAwLjgyNS0xLjQgNC4xMjUgMC4zIDguNTI1IDAgMCAyLjctMC45MSA4LjkgMy4zMjUgMi42LTAuNzI1IDUuMy0xLjEyNSA4LjEgLTEuMTI1czUuNSAwLjQyNSA4LjEgMS4xMjVjNi4yLTQuMTI1IDguOS0zLjMyNSA4LjktMy4zMjUgMS43IDQuNDI1IDAuNiA3Ljc1IDAuMyA4LjUyNSAyIDIuMjI1IDMuMyA1LjEyNSAzLjMgOC42MjUgMCAxMi4zNzUtNy40IDE1LjEyNS0xNC41IDE1LjgyNSAwLjggMS41MjUgMS43IDQuMzI1IDEuNyA2LjhyMTAgMS4xMjVjMCAuOTI1IDAuNiAxLjkyNSAyLjIgMS42MjUgMTIuNzUtNC4yMjUgMjEuOS0xNi4yMjUgMjEuOS0zMC4zMjUgMC0xNy43NzUtMTQuMzI1LTMyLjEyNS0zMi4xMjUtMzIuMTI1ek0zOC4zMjUgNDguNjVjLTIuNzUgMC40MjUtMy41LTItMy41LTIgMC0xLjI3NSAwLjc1LTIuNTI1IDIuMy0yLjUyNSAxLjUgMCAyLjI1IDAuNzI1IDIuNSAxLjc1IDAuMjUgMS4wMjUgMS41IDIuMjI1IDIuNSAxLjc1IDIgMCAzLjI1IDEuMjc1IDMuMjUgMi41MjUgMCAxLjM3NS0xLjM3NSAyLjM3NS0zLjM3NSAyLjM3NS0yLjUgMC00LjM3NS0xLjM3NS00LjUgMy4zNzVNMzAgNjIuNTI1Yy0wLjUgMC41MjUtMS4yNSAwLjc1LTIuNSAwLjc1LTIuNzUgMC0zLjUtMS4yNzUtMy41LTIuNDI1IDAtMS4yNzUgMC43NS0yLjUgMi4zNzUtMi41IDEuNSAwIDEuNzUgMC43NSAxLjc1IDEuNzUgMCAxLS43NSAxLjc1LTIuMyAxLjc1LTIuMjI1IDAtMy4yNzUgMS40MjUtMy4yNzUgMy40MjVNMzggNjguNjVjLTAgMS4yNzUtMC43NSAyLjM3NS0yLjUgMi4zNzVzLTIuMjUgLTEuNS0yLjUgLTIuNDI1Yy0wLjI1LTEuNDI1IDAuNS0yLjc3NSAyLjM3NS0yLjc3NSAxLjUgMCAyLjUgMS4xMjUgMi41IDIuNDI1ek02My40MjUgNTYuNzVjLTAuNC0wLjQyNS0xLjItMC42MjUtMi40MjUtMC42MjUtMy41IDAt1LjggMS40MjUtNS44IDQuNDI1IDAgMS45IDEuMyAzLjQyNSA0LjIgMy40MjUgMi4zIDAgNC4zNzUtMS4zIDIuOC0zLjQyNXptMTIgMy41Yy0wLjUgMC41MjUtMS4yNSAwLjc1LTIuNSAwLjc1LTIuNzUgMC0zLjUtMS4yNzUtMy41LTIuNDI1IDAtMS4yNzUgMC43NS0yLjUgMi4zNzUtMi41IDEuNSAwIDEuNzUgMC43NSAxLjc1IDEuNzUgMCAxLS43NSAxLjc1LTIuMyAxLjc1LTIuMjI1IDAtMy4yNzUgMS40MjUtMy4yNzUgMy40MjVNMzAgNzUuNzVjLTAuNSAwLjQyNS0xLjIgMC43NS0yLjUgMC43NS0yLjc1IDAtMy41LTEuMzc1LTMuNS0yLjQyNSAwLTEuMjc1IDAuNzUtMi41IDIuMzc1LTIuNSAxLjUgMCAxLjc1IDAuNzUgMS43NSAxLjc1IDAgMS0wLjc1IDEuNzUtMi4zIDEuNzUtMi4yMjUgMC0zLjI3NSAxLjM3NS0zLjI3NSAzLjQyNU0zOCA3OC43NWMtMC41IDAuNDI1LTEuMiAwLjc1LTIuNSAwLjc1LTIuNzUgMC0zLjUtMS4zNzUtMy41LTIuNDI1IDAtMS4yNzUgMC43NS0yLjUgMi4zNzUtMi41IDEuNSAwIDEuNzUgMC43NSAxLjc1IDEuNzUgMCAxLS43NSAxLjc1LTIuMyAxLjc1LTIuMjI1IDAtMy4yNzUgMS40MjUtMy4yNzUgMy40MjVNMzAgODUuNzVjLTAuNSAwLjQyNS0xLjIgMC43NS0yLjUgMC43NS0yLjc1IDAtMy41LTEuMzc1LTMuNS0yLjQyNSAwLTEuMjc1IDAuNzUtMi41IDIuMzc1LTIuNSAxLjUgMCAxLjc1IDAuNzUgMS43NSAxLjc1IDAgMS0wLjc1IDEuNzUtMi4zIDEuNzUtMi4yMjUgMC0zLjI3NSAxLjM3NS0zLjI3NSAzLjQyNU0zOCA4OC43NWMtMC41IDAuNDI1LTEuMiAwLjc1LTIuNSAwLjc1LTIuNzUgMC0zLjUtMS4zNzUtMy41LTIuNDI1IDAtMS4yNzUgMC43NS0yLjUgMi4zNzUtMi41IDEuNSAwIDEuNzUgMC43NSAxLjc1IDEuNzUgMCAxLS43NSAxLjc1LTIuMyAxLjc1LTIuMjI1IDAtMy4yNzUgMS40MjUtMy4yNzUgMy40MjVNMzUgMTAwYzAtNS01LTktOS05LTlzLTkgNS05IDkgNSA5IDkgNS05IDkgOSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==',
  // Gemini / Google
  'gemini': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxtb3N4IHN0b3A9IiUwJSIgb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6JTI0ODI1ZjQiLz48bW9zeCBzdG9wPSIlNTAlIiBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6JTI0OTI3MmNiIi8+PG1vc3ggc3RvcD0iMTAwJSIgb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjolMjNkOTY1NzAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNNTUuMjUgMjBMNjYuNjUgNDVsLTE1LjUgLTUuMjVNMzUgNDVsMTUgNS41TDM1LjI1IDUwWiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMzYuNjUgNTEuMjVMNTAgODBsMTUuMzUtLTMwTDM2LjY1IDUxLjI1WiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9Ii44Ii8+PC9zdmc+',
  'google': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiM0Mjg1ZjQiLz48cGF0aCBkPSJNNTUuMjUgMjUuMjVjLTEzLjggMC0yNS4xMjUgMTEuNDI1LTI1LjEyNSAyNS4xMjVzMTEuNDI1IDI1LjEyNSAyNS4xMjUgMjUuMTI1IDI1LjEyNS0xMS40MjUgMjUuMTI1LTI1LjEyNS0xMS40MjUtMjUuMTI1LTI1LjEyNS0yNS4xMjV6bTAgNDAuNTI1Yy04LjMyNSAwLTE1LjE1LTYuODI1LTE1LjE1LTE1LjEyNXM2LjgyNS0xNS4xMjUgMTUuMTI1LTE1LjEyNSAxNS4xMjUgNi44MjUgMTUuMTI1IDE1LjEyNS02LjgyNSAxNS4xMjUtMTUuMTI1IDE1LjEyNXoiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI1NSIgcj0iOCIga2Fyc2luZXM9InN0cm9rZSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  // Notion
  'notion': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMxYTFhMWEiLz48cmVjdCB4PSIyNSIgeT0iMjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI2MCIgcj0iNSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSI2MCIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPjxjaXJjbGUgY3g9IjI3IiBjeT0iMzUiIHI9IjMiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMjciIGN5PSI1MCIgcj0iMyIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIyNyIgY3k9IjY1IiByPSIzIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  // Hugging Face
  'huggingface': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRkQ5MUUiLz48cGF0aCBkPSJNNTUuMjUgMTVMMjcuNjUgMTVMMzUgNTVMMzcuNjUgMzUiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNNTUuMjUgNDUuMjVMMjcuNjUgNDUuMjVMMzUgODUuMjVMMzcuNjUgNjUiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
  // Vercel
  'vercel': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNNTUuMjUgMjBsMjUgNTBMMjYuNjUgNTB6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  // Copilot
  'copilot': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMxYTFhMWEiLz48cGF0aCBkPSJNMzAgNzBMNTUgMjVsMjAgNDUiIHN0cm9rZT0iIzdjM2FlZCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjQ1IiByPSI4IiBmaWxsPSIjN2MzYWVkIi8+PC9zdmc+',
  // Replit
  'replit': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiNmMjYyMDciLz48dGV4dCB4PSI1MCIgeT0iNjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj7in6jin6k8L3RleHQ+PC9zdmc+',
  // Supabase
  'supabase': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMzZWNjNDMiLz48cGF0aCBkPSJNNTUuMjUgMjBMNzEgMzVsMCAzMGwtMjEgMTVsLTIwLTE1TDMxLjY1IDM1WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  // Stable Diffusion
  'stable': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiNlZjQ4YjIiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjUwIiByPSIzMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI1MCIgcj0iMTUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=',
  // Figma
  'figma': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSI1MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj5mPC90ZXh0Pjwvc3ZnPg==',
  // Canva
  'canva': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMwMGM0Y2MiLz48dGV4dCB4PSI1MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNDUiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj5DPC90ZXh0Pjwvc3ZnPg==',
  // Perplexity
  'perplexity': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjUwIiByPSIzMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjUwIiByPSI4IiBmaWxsPSIjZmZkNzAwIi8+PC9zdmc+',
  // Cloudflare
  'cloudflare': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiNmMzgwMjAiLz48dGV4dCB4PSI1MCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMzUiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj5DRjwvdGV4dD48L3N2Zz4=',
  // Lovart
  'lovart': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiNhODU1ZjciLz48dGV4dCB4PSI1MCIgeT0iNjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj5MdjwvdGV4dD48L3N2Zz4=',
  // YouMind
  'youmind': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcj0iMjAiIGZpbGw9IiM2MzY2ZjEiLz48dGV4dCB4PSI1MCIgeT0iNjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIj5ZTTwvdGV4dD48L3N2Zz4=',
};

// 从 URL 提取域名
function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '').toLowerCase();
  } catch {
    return null;
  }
}

// 匹配工具名称获取图标
function matchKnownTool(name: string): string | null {
  const lowerName = name.toLowerCase();

  // 匹配映射表
  const matchPatterns: [string[], string][] = [
    [['chatgpt', 'chat gpt', 'gpt', 'chatgpt的提示词', 'openai'], 'chatgpt'],
    [['claude', '克劳德', '谷歌的claude'], 'claude'],
    [['midjourney', 'mj', 'midjourney官方'], 'midjourney'],
    [['github', 'copilot', 'copilot', 'github copilot'], 'github'],
    [['gemini', 'bard', '谷歌的gemini', 'gemini'], 'gemini'],
    [['notion', 'notion ai', 'notebooklm', '谷歌的notebooklm', 'notion'], 'notion'],
    [['huggingface', 'hugging face', 'hf', 'ai领域的github', 'ai 商业研究代理平台'], 'huggingface'],
    [['vercel'], 'vercel'],
    [['supabase', 'baas平台'], 'supabase'],
    [['stable', 'stable diffusion', 'comfyui', '木兰ai', 'ai 设计代理平台'], 'stable'],
    [['perplexity'], 'perplexity'],
    [['cloudflare'], 'cloudflare'],
    [['lovart', 'ai 设计代理平台'], 'lovart'],
    [['youmind', 'youmind', '仿照notebooklm'], 'youmind'],
    [['replit'], 'replit'],
    [['figma'], 'figma'],
    [['canva'], 'canva'],
  ];

  for (const [patterns, iconKey] of matchPatterns) {
    for (const pattern of patterns) {
      if (lowerName.includes(pattern)) {
        return iconKey;
      }
    }
  }

  return null;
}

// 根据分类生成默认图标 SVG
function generateCategoryIcon(category: string, firstLetter: string): string {
  const colors: Record<string, { from: string; to: string }> = {
    productivity: { from: '#3b82f6', to: '#6366f1' },   // 蓝色
    coding: { from: '#10b981', to: '#14b8a6' },         // 绿色
    content: { from: '#8b5cf6', to: '#ec4899' },        // 紫色
    chat: { from: '#f97316', to: '#ef4444' },           // 橙色
    default: { from: '#6b7280', to: '#9ca3af' },       // 灰色
  };

  const { from, to } = colors[category] || colors.default;

  // 使用简单的字母图标，避免复杂的 SVG 路径
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${from}"/>
        <stop offset="100%" style="stop-color:${to}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#grad)"/>
    <text x="50" y="68" text-anchor="middle" font-size="48" font-weight="bold" fill="white" font-family="system-ui, sans-serif">${firstLetter}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function ToolCard({
  tool,
  isLoggedIn,
  onEdit,
  onDelete,
  showActions = false,
}: ToolCardProps) {
  const pricingConfig = {
    free: { label: '免费', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
    paid: { label: '付费', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    freemium: { label: '免费/付费', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  };

  const config = pricingConfig[tool.pricing as keyof typeof pricingConfig] || pricingConfig.free;
  const categoryColor = categoryColors[tool.category as string] || categoryColors.default;

  // 获取图标 URL
  const getIconUrl = (): string | null => {
    // 1. 匹配已知工具图标
    const matchedKey = matchKnownTool(tool.name);
    if (matchedKey && knownToolIcons[matchedKey]) {
      return knownToolIcons[matchedKey];
    }

    // 2. 使用 Clearbit Logo API（如果工具有 URL）
    if (tool.url) {
      const domain = getDomainFromUrl(tool.url);
      if (domain) {
        return `https://logo.clearbit.com/${domain}`;
      }
    }

    // 3. 根据分类生成默认渐变图标
    return null;
  };

  const iconUrl = getIconUrl();
  const firstLetter = tool.name.charAt(0).toUpperCase();
  const defaultIconUrl = generateCategoryIcon(tool.category || 'default', firstLetter);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* 图标 */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColor.gradient} flex items-center justify-center overflow-hidden border border-transparent group-hover:scale-105 transition-transform`}>
          <img
            src={iconUrl || defaultIconUrl}
            alt={tool.name}
            className="w-9 h-9 object-contain"
            onError={(e) => {
              // 如果图标加载失败，使用默认图标
              (e.target as HTMLImageElement).src = defaultIconUrl;
            }}
          />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h3>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bgColor} ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {tool.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {tool.description}
            </p>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            {isLoggedIn && tool.url ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group/link"
              >
                访问工具
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                登录后访问
              </span>
            )}

            {showActions && (
              <div className="flex items-center gap-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(tool)}
                    className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    编辑
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(tool.id)}
                    className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                  >
                    删除
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
