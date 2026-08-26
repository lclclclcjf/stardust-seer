'use client';

import { use, useState, type ReactNode } from 'react';
import { getAiReading } from '@/features/ai-reading/client';
import type { AiReading, AiReadingRequest } from '@/features/ai-reading/schemas';
import styles from './ai-reading-panel.module.css';

interface AiReadingPanelProps {
  request: AiReadingRequest;
  fallback: ReactNode;
  className?: string;
}

export function AiReadingPanel({ request, fallback, className = '' }: AiReadingPanelProps) {
  const [attempt, setAttempt] = useState(0);
  const result = use(getAiReading(request, attempt));
  if (result.status === 'skipped') return null;

  if (result.status === 'error') {
    const isQuotaError = result.code === 'AI_QUOTA';
    return (
      <>
        <section className={`${styles.panel} ${className}`} role="alert" data-purpose="ai-reading-error">
          <p className={styles.eyebrow}>AI 个性解读</p>
          <h2 className={styles.title}>{isQuotaError ? 'AI 额度暂时不足' : '这次讯息暂时没有展开'}</h2>
          <p className={styles.body}>{result.message}。下方已为你保留基础牌义。</p>
          <button type="button" className={styles.retry} onClick={() => setAttempt((value) => value + 1)}>
            {isQuotaError ? '充值后重试' : '重新生成'}
          </button>
        </section>
        {fallback}
      </>
    );
  }

  return <ReadingContent reading={result.reading} className={className} />;
}

export function AiReadingQuestionPrompt({ className = '' }: { className?: string }) {
  return (
    <section className={`${styles.panel} ${className}`} role="status" data-purpose="ai-question-prompt">
      <p className={styles.eyebrow}>AI 个性解读</p>
      <h2 className={styles.title}>输入问题，获得专属解读</h2>
      <p className={styles.body}>这次没有填写问题，因此当前展示基础牌义。重新占卜时输入问题，AI 会结合问题与牌面生成独特解读。</p>
    </section>
  );
}

export function AiReadingLoading({ className = '' }: { className?: string }) {
  return (
    <section
      className={`${styles.panel} ${styles.loading} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-purpose="ai-reading-loading"
    >
      <span className={styles.pulse} aria-hidden="true" />
      <div>
        <p className={styles.eyebrow}>AI 个性解读</p>
        <p className={styles.body}>庭院正在结合你的问题与这次牌面整理讯息…</p>
      </div>
    </section>
  );
}

function ReadingContent({ reading, className }: { reading: AiReading; className: string }) {
  return (
    <section className={`${styles.panel} ${className}`} aria-labelledby="ai-reading-title" data-purpose="ai-reading">
      <p className={styles.eyebrow}>AI 个性解读</p>
      <h2 id="ai-reading-title" className={styles.title}>为这次提问而生的讯息</h2>
      <p className={styles.lead}>{reading.coreMessage}</p>
      <CardReadings reading={reading} />
      <div className={styles.synthesis}>
        <h3>综合解读</h3>
        <p>{reading.synthesis}</p>
      </div>
      <Guidance reading={reading} />
      <blockquote className={styles.reflection}>{reading.reflectionQuestion}</blockquote>
      <p className={styles.disclaimer}>{reading.disclaimer}</p>
    </section>
  );
}

function CardReadings({ reading }: { reading: AiReading }) {
  return (
    <ol className={styles.cardReadings} aria-label="各牌位的个性解读">
      {reading.cardReadings.map((item) => (
        <li key={item.position}>
          <span>{String(item.position + 1).padStart(2, '0')}</span>
          <div><h3>{item.title}</h3><p>{item.interpretation}</p></div>
        </li>
      ))}
    </ol>
  );
}

function Guidance({ reading }: { reading: AiReading }) {
  return (
    <div className={styles.guidance}>
      <h3>可以带走的行动</h3>
      <ul>{reading.guidance.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
