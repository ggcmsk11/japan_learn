<template>
  <div class="privacy-page">
    <div class="page-header">
      <div class="container">
        <h1>隐私政策</h1>
        <p>最后更新日期：2024年1月1日</p>
      </div>
    </div>

    <div class="container">
      <div class="privacy-content">
        <section class="privacy-section">
          <h2>1. 信息收集</h2>
          <p>我们收集的信息包括但不限于：</p>
          <ul>
            <li>基本信息（姓名、邮箱地址、电话号码等）</li>
            <li>账户信息（用户名、密码等）</li>
            <li>学习记录（学习进度、测试成绩等）</li>
            <li>使用数据（访问时间、设备信息等）</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>2. 信息使用</h2>
          <p>我们使用收集的信息用于：</p>
          <ul>
            <li>提供和改进服务</li>
            <li>个性化学习体验</li>
            <li>发送课程通知和更新</li>
            <li>处理支付交易</li>
            <li>提供客户支持</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>3. 信息保护</h2>
          <p>我们采取以下措施保护您的信息：</p>
          <ul>
            <li>使用加密技术保护数据传输</li>
            <li>定期备份数据</li>
            <li>限制员工访问权限</li>
            <li>定期安全审计</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>4. 信息共享</h2>
          <p>我们不会与第三方共享您的个人信息，除非：</p>
          <ul>
            <li>获得您的明确同意</li>
            <li>法律要求提供</li>
            <li>保护我们的合法权益</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>5. Cookie使用</h2>
          <p>我们使用Cookie来：</p>
          <ul>
            <li>记住您的登录状态</li>
            <li>分析网站使用情况</li>
            <li>改善用户体验</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>6. 用户权利</h2>
          <p>您有权：</p>
          <ul>
            <li>访问您的个人信息</li>
            <li>更正不准确的信息</li>
            <li>要求删除个人信息</li>
            <li>退订营销信息</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>7. 政策更新</h2>
          <p>我们可能会不时更新本隐私政策。更新后的政策将在网站上公布，并注明更新日期。</p>
        </section>

        <section class="privacy-section">
          <h2>8. 联系我们</h2>
          <p>如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
          <div class="contact-info">
            <p><i class="ri-mail-line"></i> Email: privacy@chunshuariyu.com</p>
            <p><i class="ri-customer-service-2-line"></i> 电话: 400-123-4567</p>
            <p><i class="ri-map-pin-line"></i> 地址: 上海市浦东新区xxx路xxx号</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this page
</script>

<style lang="scss" scoped>
.privacy-page {
  padding-bottom: var(--spacing-xxl);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
  }
}

.privacy-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.privacy-section {
  margin-bottom: var(--spacing-xl);

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-md);
    color: var(--primary-color);
  }

  p {
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
    color: var(--text-color);
  }

  ul {
    list-style: none;
    padding-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);

    li {
      position: relative;
      margin-bottom: var(--spacing-sm);
      color: var(--text-light);

      &::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 10px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--primary-color);
      }
    }
  }
}

.contact-info {
  background-color: var(--background-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);

  p {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    color: var(--text-light);

    &:last-child {
      margin-bottom: 0;
    }

    i {
      color: var(--primary-color);
      font-size: 1.2rem;
    }
  }
}
</style>