/**
 * Remove todos os documentos da coleção "contratos" no Firestore.
 *
 * Pré-requisito: Firebase CLI autenticado no projeto dashboards-80eb1
 *   npx firebase login --reauth
 *
 * Uso:
 *   npm run firebase:delete-contratos
 */

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const projectId = 'dashboards-80eb1'

const result = spawnSync(
  'npx',
  ['firebase', 'firestore:delete', 'contratos', '-r', '-f', '--project', projectId],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  }
)

if (result.status !== 0) {
  console.error('\nFalha ao apagar contratos. Execute antes: npx firebase login --reauth')
  process.exit(result.status ?? 1)
}

console.log('\nColeção "contratos" apagada com sucesso.')
