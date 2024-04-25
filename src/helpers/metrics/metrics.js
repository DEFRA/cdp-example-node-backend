import {
  createMetricsLogger,
  Unit,
  StorageResolution
} from 'aws-embedded-metrics'
import { createLogger } from '~/src/helpers/logging/logger'

const logger = createLogger()

const counter = async (metricName, value = 1) => {
  try {
    const metrics = createMetricsLogger()
    metrics.putMetric(metricName, value, Unit.Count, StorageResolution.Standard)
    await metrics.flush()
  } catch (e) {
    logger.warn(e)
  }
}

export { counter }
