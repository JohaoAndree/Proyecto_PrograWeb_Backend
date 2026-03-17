import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('Endpoints de Estadísticas (Johao)', () => {
  
  it('GET /api/johao/ventas/count - Debe retornar el conteo total de ventas', async () => {
    const response = await request(app).get('/api/johao/ventas/count');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalVentas');
    expect(typeof response.body.totalVentas).toBe('number');
    // Como sembramos 5 ventas, debería ser al menos 5 si no se han borrado
    expect(response.body.totalVentas).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/johao/ventas/ganancias - Debe retornar el reporte mensual de ganancias', async () => {
    const response = await request(app).get('/api/johao/ventas/ganancias');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(12); // Siempre debe devolver los últimos 12 meses
    
    // Verificar estructura de un mes
    const primerMes = response.body[0];
    expect(primerMes).toHaveProperty('mes');
    expect(primerMes).toHaveProperty('total');
    expect(typeof primerMes.mes).toBe('string');
    expect(typeof primerMes.total).toBe('number');
  });

  it('GET /api/johao/usuarios/count - Debe retornar el conteo de usuarios', async () => {
    const response = await request(app).get('/api/johao/usuarios/count');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalUsuarios');
    expect(typeof response.body.totalUsuarios).toBe('number');
  });

  it('GET /api/johao/usuarios/admin - Debe retornar el perfil del admin', async () => {
    const response = await request(app).get('/api/johao/usuarios/admin');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nombre');
    expect(response.body.nombre).toBe('Administrador'); // Asumiendo que es el nombre en el seed
    expect(response.body).toHaveProperty('foto');
  });
});
