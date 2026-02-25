import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { sql } from '@/app/lib/db';

// API 测试辅助函数
async function makeRequest(
  method: string,
  url: string,
  body?: object
): Promise<Response> {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  return fetch(`${baseUrl}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('Habit API Routes', () => {
  // 测试数据
  const testTaskId = 'test-habit-001';
  
  beforeAll(async () => {
    // 创建测试任务
    await sql`
      INSERT INTO tasks (
        id, title, description, type, status, difficulty, 
        project_id, points, gold_reward, current_count, target_count
      ) VALUES (
        ${testTaskId}, '测试习惯', '测试描述', 'habit', 'todo', 'medium',
        'test-project', 10, 3.5, 5, 10
      )
    `;
  });

  afterAll(async () => {
    // 清理测试数据
    await sql`DELETE FROM task_history WHERE task_id = ${testTaskId}`;
    await sql`DELETE FROM tasks WHERE id = ${testTaskId}`;
  });

  afterEach(async () => {
    // 重置测试任务状态
    await sql`
      UPDATE tasks 
      SET current_count = 5, total_count = 20, streak = 3
      WHERE id = ${testTaskId}
    `;
  });

  describe('POST /api/tasks/[id]/increment', () => {
    it('应增加当前计数并返回新值', async () => {
      const response = await makeRequest('POST', `/api/tasks/${testTaskId}/increment`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.currentCount).toBe(6);
      expect(data.data.totalCount).toBe(21);
      expect(data.data.streak).toBe(4);
    });

    it('不存在任务时应返回404', async () => {
      const response = await makeRequest('POST', '/api/tasks/non-existent/increment');
      
      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('应添加历史记录', async () => {
      await makeRequest('POST', `/api/tasks/${testTaskId}/increment`);
      
      const history = await sql`
        SELECT * FROM task_history 
        WHERE task_id = ${testTaskId} 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].action).toBe('completed');
    });
  });

  describe('POST /api/tasks/[id]/decrement', () => {
    it('应减少当前计数并返回新值', async () => {
      const response = await makeRequest('POST', `/api/tasks/${testTaskId}/decrement`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.currentCount).toBe(4);
    });

    it('计数为0时应返回400', async () => {
      // 先将计数设为0
      await sql`UPDATE tasks SET current_count = 0 WHERE id = ${testTaskId}`;
      
      const response = await makeRequest('POST', `/api/tasks/${testTaskId}/decrement`);
      
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('应防止计数变为负数', async () => {
      await sql`UPDATE tasks SET current_count = 0 WHERE id = ${testTaskId}`;
      
      const response = await makeRequest('POST', `/api/tasks/${testTaskId}/decrement`);
      
      const task = await sql`SELECT current_count FROM tasks WHERE id = ${testTaskId}`;
      expect(task[0].current_count).toBe(0);
    });
  });

  describe('GET /api/tasks/[id]/heatmap', () => {
    beforeAll(async () => {
      // 添加一些历史记录
      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        await sql`
          INSERT INTO task_history (task_id, action, description, timestamp)
          VALUES (
            ${testTaskId}, 
            'completed', 
            '测试完成', 
            ${date}
          )
        `;
      }
    });

    it('应返回热力图数据', async () => {
      const response = await makeRequest('GET', `/api/tasks/${testTaskId}/heatmap`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.days).toBeInstanceOf(Array);
      expect(data.data.days.length).toBe(90);
      expect(data.data).toHaveProperty('currentWeekCount');
      expect(data.data).toHaveProperty('completionRate');
      expect(data.data).toHaveProperty('longestStreak');
    });

    it('每天应有count字段', async () => {
      const response = await makeRequest('GET', `/api/tasks/${testTaskId}/heatmap`);
      const data = await response.json();
      
      const day = data.data.days[0];
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('count');
    });
  });

  describe('GET /api/tasks/[id]/trends', () => {
    it('应返回趋势数据', async () => {
      const response = await makeRequest('GET', `/api/tasks/${testTaskId}/trends`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.weeks).toBeInstanceOf(Array);
    });

    it('每周应有week和completed字段', async () => {
      const response = await makeRequest('GET', `/api/tasks/${testTaskId}/trends`);
      const data = await response.json();
      
      if (data.data.weeks.length > 0) {
        const week = data.data.weeks[0];
        expect(week).toHaveProperty('week');
        expect(week).toHaveProperty('completed');
      }
    });

    it('没有历史数据时应返回示例数据', async () => {
      // 创建没有历史记录的任务
      const newTaskId = 'test-empty-trends';
      await sql`
        INSERT INTO tasks (id, title, type, project_id)
        VALUES (${newTaskId}, '空趋势任务', 'habit', 'test-project')
      `;
      
      const response = await makeRequest('GET', `/api/tasks/${newTaskId}/trends`);
      const data = await response.json();
      
      expect(data.data.weeks.length).toBeGreaterThan(0);
      
      // 清理
      await sql`DELETE FROM tasks WHERE id = ${newTaskId}`;
    });
  });
});
