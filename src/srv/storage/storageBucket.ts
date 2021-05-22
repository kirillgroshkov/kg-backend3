import type { Bucket, File, GetFilesOptions } from '@google-cloud/storage'
import { AppError } from '@naturalcycles/js-lib'

export interface StorageBucketCfg {
  /**
   * Can be obtained from CloudStorage or from Firebase Storage.
   *
   * @example
   *
   * const bucket = firebaseService.admin().storage().bucket()
   */
  bucket: Bucket
}

export class StorageBucket {
  constructor(public cfg: StorageBucketCfg) {}

  // Convenience function to do low-level commands on File
  file(path: string): File {
    return this.cfg.bucket.file(path)
  }

  async fileExists(path: string): Promise<boolean> {
    const [exists] = await this.cfg.bucket.file(path).exists()
    return exists
  }

  async getFile(path: string): Promise<Buffer | null> {
    const [r] = await this.cfg.bucket
      .file(path)
      .download()
      .catch(err => {
        if (err?.code === 404) return [] // file not found
        throw err // rethrow otherwise
      })
    return r || null
  }

  async requireFile(path: string): Promise<Buffer> {
    const r = await this.getFile(path)
    if (!r) {
      throw new AppError(`requireFile not found: ${this.cfg.bucket.name}/${path}`, {
        userFriendly: true,
        code: 'StorageBucket.requireFile',
        bucketName: this.cfg.bucket.name,
        path,
      })
    }
    return r
  }

  async getFileAsString(path: string): Promise<string | null> {
    const r = await this.getFile(path)
    return r?.toString('utf8') || null
  }

  async requireFileAsString(path: string): Promise<string> {
    const r = await this.requireFile(path)
    return r.toString('utf8')
  }

  async getFileAsJson<T = any>(path: string): Promise<T | null> {
    const r = await this.getFile(path)
    if (!r) return null
    return JSON.parse(r.toString('utf8'))
  }

  async saveFile(path: string, content: Buffer | string): Promise<void> {
    await this.cfg.bucket.file(path).save(content)
  }

  async savePublicFile(path: string, content: Buffer | string): Promise<void> {
    await this.cfg.bucket.file(path).save(content)
    await this.cfg.bucket.file(path).makePublic()
  }

  async saveJsonFile(path: string, content: any, pretty = false): Promise<void> {
    await this.cfg.bucket.file(path).save(JSON.stringify(content, null, pretty ? 2 : undefined))
  }

  /**
   * Strips away bucket name and path, leaving only pure fileNames
   */
  async getFileNames(path: string, opt: GetFilesOptions = {}): Promise<string[]> {
    const directory = path.endsWith('/') ? path : path + '/'
    const start = directory.length
    const [files] = await this.cfg.bucket.getFiles({
      directory,
      ...opt,
    })
    return files.map(f => f.name.slice(start))
  }

  /**
   * Will throw if file doesn't exist.
   */
  async deleteFile(path: string): Promise<void> {
    await this.cfg.bucket
      .file(path)
      .delete()
      .catch(err => {
        if (err?.code === 404) {
          throw new AppError(`deleteFile not found: ${path}`, {
            userFriendly: true,
            code: `StorageBucket.deleteFile`,
            path,
            bucketName: this.cfg.bucket.name,
          })
        }

        throw err // rethrow
      })
  }

  /**
   * @returns true if file existed
   */
  async deleteFileIfExists(path: string): Promise<boolean> {
    try {
      await this.cfg.bucket.file(path).delete()
      return true
    } catch (err) {
      console.error(err) // todo: remove
      return false
    }
  }

  /**
   * Recursively (hopefully) deletes all files in a "folder".
   */
  async deleteFolder(path: string): Promise<void> {
    const directory = path.endsWith('/') ? path : path + '/'

    await this.cfg.bucket.deleteFiles({
      directory,
    })
  }
}
