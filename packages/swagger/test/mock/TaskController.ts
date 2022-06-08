import { Body, Controller, Delete, Get, Params, Post, Put } from '@bubojs/api'

@Controller('tasks')
export class TaskController {
  @Get('/')
  getTasks() {}

  @Get('/:id')
  getOneTask(@Params('id') id: string) {}

  @Post('/')
  createTask(@Body body: any) {}

  @Put('/:id')
  modifyTask(@Body body: any) {}

  @Delete('/:id')
  deleteTask(@Params('id') id: string) {}
}
