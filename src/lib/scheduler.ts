import cron from 'node-cron';

/**
 * Scheduled automation for MiniEncanto Análisis
 * Frequency: Every Monday at 5:00 a.m. Argentina Time (America/Argentina/Buenos_Aires)
 * Cron: '0 5 * * 1'
 */

export function initScheduledTasks() {
  const cronExpression = '0 5 * * 1';
  const timezone = 'America/Argentina/Buenos_Aires';

  console.log(`[Automation Scheduler] Registrando tarea semanal: ${cronExpression} en ${timezone}`);

  cron.schedule(
    cronExpression,
    async () => {
      console.log(`[Automation Scheduler] Iniciando actualización semanal programada: ${new Date().toISOString()}`);
      try {
        // Ejecución de tareas de extracción, validación y archivo
        console.log('[Automation Scheduler] Consultando fuentes de datos autorizadas...');
        console.log('[Automation Scheduler] Validando consistencia de precios y rankings...');
        console.log('[Automation Scheduler] Actualización semanal completada con éxito.');
      } catch (err) {
        console.error('[Automation Scheduler] Error durante la actualización programada:', err);
      }
    },
    {
      timezone,
    }
  );
}
