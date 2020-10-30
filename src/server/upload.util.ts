import expressFileUpload = require('express-fileupload')

export const fileUploadHandler = expressFileUpload({
  abortOnLimit: true,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Mb
  },
})
