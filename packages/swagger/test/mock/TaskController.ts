import { Body, Controller, Delete, Get, Params, Post, Put } from '@bubojs/api'

@Controller({ overrideRouteName: 'tasks' })
export class TaskController {
  @Get('/')
  getTasks() {
    return [{ id: 1 }, { id: 2 }]
  }

  @Get('/:id')
  getOneTask(@Params('id') id: string) {
    return { id: 1 }
  }

  @Post('/')
  createTask(@Body() body: any) {
    return { id: 2, status: 'created' }
  }

  @Put('/:id')
  modifyTask(@Body() body: any) {
    return { id: 2, status: 'modified' }
  }

  @Delete('/:id')
  deleteTask(@Params('id') id: string) {
    return null
  }
}
