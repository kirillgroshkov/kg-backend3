import { loadSecretsFromEnv, loadSecretsFromJsonFile, secret } from '@naturalcycles/nodejs-lib'
import { secretDir } from '@src/cnst/paths.cnst'

loadSecretsFromEnv()
loadSecretsFromJsonFile(`${secretDir}/prod.secrets.json.enc`, secret('SECRET_ENCRYPTION_KEY'))
