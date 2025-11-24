import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { WrongTaskStatusTransitionException } from './execeptions/wrong-task-status-transition-exception';
import { UpdateTaskDto } from './update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): ITask | undefined {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  //   @Patch('/:id/status')
  //   public updateStatus(
  //     @Param() params: FindOneParams,
  //     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   ): ITask | undefined {
  //     const task = this.findOneOrFail(params.id);
  //     task.status = updateTaskStatusDto.status;
  //     return task;
  //   }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteTask(@Param() params: FindOneParams): void {
    const task = this.findOneOrFail(params.id);
    this.tasksService.deleteTask(task);
  }

  @Patch('/:id')
  public updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): ITask | undefined {
    const task = this.findOneOrFail(params.id);

    try {
      return this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusTransitionException) {
        throw new BadRequestException(error.message);
      }

      throw new Error('asss');
    }
  }

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}
