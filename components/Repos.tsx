'use client';

export default function Repos() {
  const repos = [
    {
      id: 1,
      title: 'E-commerce',
      icon: 'bx-cart',
      description: 'Nền tảng bán hàng online. Tối ưu SEO, load nhanh như cách người yêu cũ trở mặt.',
      tags: ['React', 'Node'],
      titleColor: 'var(--foam)',
      filename: 'shop.exe',
      titleStyle: {},
    },
    {
      id: 2,
      title: 'Realtime Chat',
      icon: 'bx-message-square-dots',
      description: 'Nhắn tin bảo mật End-to-End. Không lưu log, chỉ lưu kỷ niệm.',
      tags: ['Socket.io', 'Mongo'],
      titleColor: 'var(--rose)',
      filename: 'chat_v1.sh',
      titleStyle: { color: 'var(--rose)' },
      tagsStyle: { color: 'var(--rose)' },
    },
  ];

  return (
    <section className="tab-content active">
      <h2 className="section-title">./public_repositories</h2>
      <div className="grid-container">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <div className="window-header">
              <span className="window-title">{repo.filename}</span>
              <div className="window-controls">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
              </div>
            </div>
            <div className="repo-content">
              <h3 className="r-title" style={repo.titleStyle}>
                <i className={`bx ${repo.icon}`}></i> {repo.title}
              </h3>
              <p className="r-desc">{repo.description}</p>
              <div className="r-tags" style={repo.tagsStyle}>
                {repo.tags.map((tag, idx) => (
                  <span key={idx} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
