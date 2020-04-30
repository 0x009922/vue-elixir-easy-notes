import axios from 'axios';

/**
 * Инстанс axios с установленным префиксом для обращения к API
 */
export default axios.create({
  baseURL: '/api',
});
