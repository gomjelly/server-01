import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.originalname}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }
    console.log('Uploaded file:', file);
    return { message: 'File uploaded successfully!', fileName: file.filename };
  }

  @Get(':filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'files', filename);
    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  }
}

