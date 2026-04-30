import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FlujoService } from './flujo.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateAccionDto, UpdateAccionDto } from './dto/accion.dto';
import { CreateActividadDto, UpdateActividadDto } from './dto/actividad.dto';
import { CreateOperacionDto, UpdateOperacionDto } from './dto/operacion.dto';
import {
  CreateOperacionCargoDto,
  UpdateOperacionCargoDto,
} from './dto/operacion-cargo.dto';
import { CreateTareaDto, UpdateTareaDto } from './dto/tarea.dto';

@ApiTags('Flujo de Procedimientos')
@Controller('flujo')
export class FlujoController {
  constructor(private readonly service: FlujoService) {}

  // --- Operaciones ---

  @Post('operaciones')
  @ApiOperation({ summary: 'Crear una nueva operación' })
  @ApiResponse({ status: 201, description: 'Operación creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createOperacion(@Body() createDto: CreateOperacionDto) {
    return this.service.createOperacion(createDto);
  }

  @Get('operaciones')
  @ApiOperation({ summary: 'Listar todas las operaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operaciones obtenida exitosamente.',
  })
  findAllOperaciones() {
    return this.service.findAllOperaciones();
  }

  @Get('operaciones/:id')
  @ApiOperation({ summary: 'Obtener una operación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la operación' })
  @ApiResponse({ status: 200, description: 'Operación encontrada.' })
  @ApiResponse({ status: 404, description: 'Operación no encontrada.' })
  findOneOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneOperacion(id);
  }

  @Patch('operaciones/:id')
  @ApiOperation({ summary: 'Actualizar una operación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la operación' })
  @ApiResponse({
    status: 200,
    description: 'Operación actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Operación no encontrada.' })
  updateOperacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOperacionDto,
  ) {
    return this.service.updateOperacion(id, updateDto);
  }

  @Delete('operaciones/:id')
  @ApiOperation({ summary: 'Eliminar una operación (Borrado lógico)' })
  @ApiParam({ name: 'id', description: 'ID de la operación' })
  @ApiResponse({
    status: 200,
    description: 'Operación eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Operación no encontrada.' })
  removeOperacion(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeOperacion(id);
  }

  // --- Actividades ---

  @Post('actividades')
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createActividad(@Body() createDto: CreateActividadDto) {
    return this.service.createActividad(createDto);
  }

  @Get('actividades')
  @ApiOperation({ summary: 'Listar todas las actividades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades obtenida exitosamente.',
  })
  findAllActividades() {
    return this.service.findAllActividades();
  }

  @Get('actividades/:id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  findOneActividad(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneActividad(id);
  }

  @Patch('actividades/:id')
  @ApiOperation({ summary: 'Actualizar una actividad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({
    status: 200,
    description: 'Actividad actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  updateActividad(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateActividadDto,
  ) {
    return this.service.updateActividad(id, updateDto);
  }

  @Delete('actividades/:id')
  @ApiOperation({ summary: 'Eliminar una actividad (Borrado lógico)' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({
    status: 200,
    description: 'Actividad eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  removeActividad(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeActividad(id);
  }

  // --- Acciones ---

  @Post('acciones')
  @ApiOperation({ summary: 'Crear una nueva acción' })
  @ApiResponse({ status: 201, description: 'Acción creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createAccion(@Body() createDto: CreateAccionDto) {
    return this.service.createAccion(createDto);
  }

  @Get('acciones')
  @ApiOperation({ summary: 'Listar todas las acciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de acciones obtenida exitosamente.',
  })
  findAllAcciones() {
    return this.service.findAllAcciones();
  }

  @Get('acciones/:id')
  @ApiOperation({ summary: 'Obtener una acción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la acción' })
  @ApiResponse({ status: 200, description: 'Acción encontrada.' })
  @ApiResponse({ status: 404, description: 'Acción no encontrada.' })
  findOneAccion(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneAccion(id);
  }

  @Patch('acciones/:id')
  @ApiOperation({ summary: 'Actualizar una acción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la acción' })
  @ApiResponse({ status: 200, description: 'Acción actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Acción no encontrada.' })
  updateAccion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAccionDto,
  ) {
    return this.service.updateAccion(id, updateDto);
  }

  @Delete('acciones/:id')
  @ApiOperation({ summary: 'Eliminar una acción (Borrado lógico)' })
  @ApiParam({ name: 'id', description: 'ID de la acción' })
  @ApiResponse({ status: 200, description: 'Acción eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Acción no encontrada.' })
  removeAccion(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAccion(id);
  }

  // --- Operación-Cargo ---

  @Post('operacion-cargos')
  @ApiOperation({ summary: 'Crear una nueva relación Operación-Cargo' })
  @ApiResponse({ status: 201, description: 'Relación creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createOperacionCargo(@Body() createDto: CreateOperacionCargoDto) {
    return this.service.createOperacionCargo(createDto);
  }

  @Get('operacion-cargos')
  @ApiOperation({ summary: 'Listar todas las relaciones Operación-Cargo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida exitosamente.',
  })
  findAllOperacionCargos() {
    return this.service.findAllOperacionCargos();
  }

  @Get('operacion-cargos/:id')
  @ApiOperation({ summary: 'Obtener una relación Operación-Cargo por ID' })
  @ApiParam({ name: 'id', description: 'ID de la relación' })
  @ApiResponse({ status: 200, description: 'Relación encontrada.' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada.' })
  findOneOperacionCargo(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneOperacionCargo(id);
  }

  @Patch('operacion-cargos/:id')
  @ApiOperation({ summary: 'Actualizar una relación Operación-Cargo por ID' })
  @ApiParam({ name: 'id', description: 'ID de la relación' })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada.' })
  updateOperacionCargo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOperacionCargoDto,
  ) {
    return this.service.updateOperacionCargo(id, updateDto);
  }

  @Delete('operacion-cargos/:id')
  @ApiOperation({
    summary: 'Eliminar una relación Operación-Cargo (Borrado lógico)',
  })
  @ApiParam({ name: 'id', description: 'ID de la relación' })
  @ApiResponse({ status: 200, description: 'Relación eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada.' })
  removeOperacionCargo(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeOperacionCargo(id);
  }

  // --- Tareas ---

  @Post('tareas')
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createTarea(@Body() createDto: CreateTareaDto) {
    return this.service.createTarea(createDto);
  }

  @Get('tareas')
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente.',
  })
  findAllTareas() {
    return this.service.findAllTareas();
  }

  @Get('tareas/:id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  findOneTarea(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTarea(id);
  }

  @Patch('tareas/:id')
  @ApiOperation({ summary: 'Actualizar una tarea por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  updateTarea(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTareaDto,
  ) {
    return this.service.updateTarea(id, updateDto);
  }

  @Delete('tareas/:id')
  @ApiOperation({ summary: 'Eliminar una tarea (Borrado lógico)' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  removeTarea(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTarea(id);
  }
}
