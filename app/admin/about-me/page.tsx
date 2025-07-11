import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AboutMeManagement = () => {
  const technicalSkills = {
    'Language & Framework': ['TypeScript', 'React', 'Next.js（App Router / Page Router）'],
    'State Management & Validation': [
      'Zustand / Redux（Global State）',
      'React Query（Server State）',
      'React Hook Form（Form Management）',
      'Zod / Yup（Data Validation）'
    ],
    'UI Library': ['Tailwind CSS', 'Styled Components', 'Material UI', 'Shadcn'],
    'DevOps': ['Linux', 'Jenkins', 'Docker', 'Nginx（Web Server / Reverse Proxy）'],
    'Back-end & Database': ['Node.js（Express）', 'PostgreSQL'],
    'Build Tools & Others': ['Vite', 'Turborepo', 'WebSocket（Socket.io）', 'RxJS']
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">關於我</h1>
          <p className="text-muted-foreground">About Me</p>
        </div>

        {/* Personal Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">個人簡介</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              您好，我是邱韋中，一名前端工程師，專注於使用 React 與 Next.js 打造平台型產品。目前帶領
              4–5 人的工程團隊，負責從 UI 設計到系統整合的整體開發流程，並在多個 B2B 與 B2C
              專案中累積了豐富的實戰經驗。
            </p>

            <p className="leading-relaxed">
              多數專案的前端由我獨立開發，具備從零建構系統的能力，熟悉架構規劃、模組設計與效能優化等實務流程。
            </p>
            <p className="leading-relaxed">
              除了前端開發，我也長期擔任 PM 協助跨部門溝通、需求拆解與進度規劃，並持續推動
              CI/CD、模組化開發、程式碼品質優化等工作，提升整體團隊的開發效率與穩定性。
            </p>

            <p className="leading-relaxed">
              近年來，隨著 AI 技術與系統複雜度日益提升，我開始投入後端與 DevOps
              領域的學習與實作，包括 Node.js、PostgreSQL、Docker、Nginx 及 Jenkins
              等技術，目的並非單純轉型為全端工程師，而是希望強化系統設計能力（System
              Design），更有策略性地參與架構設計與技術決策，為未來更複雜、整合性更高的產品需求做準備。
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Technical Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">技術專長</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(technicalSkills).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-primary text-lg font-semibold">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">核心能力</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-primary font-semibold">技術領導</h4>
                <p className="text-muted-foreground text-sm">
                  帶領 4-5 人工程團隊，負責技術決策與架構設計
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-primary font-semibold">全端開發</h4>
                <p className="text-muted-foreground text-sm">
                  從前端到後端，具備完整的系統開發能力
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-primary font-semibold">專案管理</h4>
                <p className="text-muted-foreground text-sm">
                  兼具 PM 經驗，擅長需求拆解與跨部門協作
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-primary font-semibold">持續改進</h4>
                <p className="text-muted-foreground text-sm">
                  推動 CI/CD、模組化等最佳實踐提升開發效率
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutMeManagement;
