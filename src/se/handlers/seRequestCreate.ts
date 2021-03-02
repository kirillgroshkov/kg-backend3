import { seRequestDao, SERequestInput } from '@src/se/seRequest.model'
import { seSlack } from '@src/se/seSlack'

export async function seRequestCreate(input: SERequestInput): Promise<void> {
  await seRequestDao.save({
    ...input,
  })

  void seSlack.log(`New Request!`, input)
}
