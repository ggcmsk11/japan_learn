<template>
  <div class="terms-page">
    <div class="page-header">
      <div class="container">
        <h1>使用条款</h1>
        <p>最后更新日期：2024年1月1日</p>
      </div>
    </div>

    <div class="container">
      <div class="terms-content">
        <section class="terms-section">
          <h2>1. 服务说明</h2>
          <p>纯刷日语是一个在线日语学习平台，提供以下服务：</p>
          <ul>
            <li>在线日语课程</li>
            <li>练习题和测试</li>
            <li>学习资料下载</li>
            <li>师生互动</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>2. 用户责任</h2>
          <p>用户在使用本平台时应：</p>
          <ul>
            <li>提供真实、准确的个人信息</li>
            <li>保护账号和密码安全</li>
            <li>遵守相关法律法规</li>
            <li>尊重知识产权</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>3. 付费服务</h2>
          <p>关于付费课程和服务：</p>
          <ul>
            <li>课程费用以实际标价为准</li>
            <li>支付成功后立即生效</li>
            <li>不支持退款，请谨慎购买</li>
            <li>会员服务按月/年计费</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>4. 知识产权</h2>
          <p>平台内容的知识产权说明：</p>
          <ul>
            <li>课程内容版权归本平台所有</li>
            <li>未经许可不得复制或传播</li>
            <li>仅供个人学习使用</li>
            <li>违规使用将承担法律责任</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>5. 账号管理</h2>
          <p>关于用户账号：</p>
          <ul>
            <li>每个用户只能注册一个账号</li>
            <li>禁止出售或转让账号</li>
            <li>违规账号将被封禁</li>
            <li>可申请注销账号</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>6. 免责声明</h2>
          <p>我们不承担以下责任：</p>
          <ul>
            <li>因不可抗力导致的服务中断</li>
            <li>用户个人原因造成的损失</li>
            <li>第三方链接的内容</li>
            <li>非平台原因的技术问题</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>7. 协议修改</h2>
          <p>我们保留随时修改本协议的权利：</p>
          <ul>
            <li>修改后将在网站公布</li>
            <li>继续使用视为接受新条款</li>
            <li>重大变更将专门通知</li>
            <li>不同意可以停止使用服务</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>8. 争议解决</h2>
          <p>关于争议处理：</p>
          <ul>
            <li>优先协商解决</li>
            <li>适用中华人民共和国法律</li>
            <li>管辖权归属上海市法院</li>
          </ul>
        </section>

        <div class="terms-footer">
          <p>如果您对本使用条款有任何疑问，请联系我们：</p>
          <div class="contact-info">
            <p><i class="ri-mail-line"></i> Email: terms@chunshuariyu.com</p>
            <p><i class="ri-customer-service-2-line"></i> 电话: 400-123-4567</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this page
</script>

<style lang="scss" scoped>
.terms-page {
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

.terms-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.terms-section {
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

.terms-footer {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
  text-align: center;

  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-light);
  }
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);

  p {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin: 0;

    i {
      color: var(--primary-color);
      font-size: 1.2rem;
    }
  }
}
</style>