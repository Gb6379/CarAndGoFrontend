import { css } from 'styled-components';
import modernTheme from './modernTheme';

export const pageShellCss = css`
  max-width: ${modernTheme.widths.content};
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

export const glassPanelCss = css`
  background: ${modernTheme.gradients.section};
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: ${modernTheme.radii.lg};
  box-shadow: ${modernTheme.shadows.soft};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const solidPanelCss = css`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  border: 1px solid rgba(255, 255, 255, 0.84);
  border-radius: ${modernTheme.radii.lg};
  box-shadow: ${modernTheme.shadows.soft};
`;

export const darkPanelCss = css`
  background: ${modernTheme.gradients.dark};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${modernTheme.radii.xl};
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.22);
`;

export const titleCss = css`
  color: ${modernTheme.colors.ink};
  letter-spacing: -0.03em;
`;

export const subtitleCss = css`
  color: ${modernTheme.colors.muted};
  line-height: 1.6;
`;

export const formFieldCss = css`
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  font-size: 1rem;
  color: ${modernTheme.colors.ink};
  background: rgba(255, 255, 255, 0.84);
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(246, 136, 92, 0.45);
    box-shadow: 0 0 0 4px rgba(246, 136, 92, 0.12);
    background: white;
  }

  &::placeholder {
    color: ${modernTheme.colors.muted};
  }
`;

export const labelCss = css`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${modernTheme.colors.inkSoft};
`;

export const primaryButtonCss = css`
  background: ${modernTheme.gradients.brand};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: ${modernTheme.radii.pill};
  box-shadow: ${modernTheme.shadows.glow};
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 60px rgba(220, 94, 49, 0.28);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    transform: none;
  }
`;

export const secondaryButtonCss = css`
  background: rgba(255, 255, 255, 0.72);
  color: ${modernTheme.colors.inkSoft};
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: ${modernTheme.radii.pill};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    background: white;
    transform: translateY(-1px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
  }
`;

export const infoNoticeCss = css`
  padding: 1rem 1.1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  color: ${modernTheme.colors.inkSoft};
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
`;

export const errorNoticeCss = css`
  ${infoNoticeCss};
  background: rgba(255, 241, 242, 0.92);
  border-color: rgba(248, 113, 113, 0.18);
  color: #b91c1c;
`;

export const successNoticeCss = css`
  ${infoNoticeCss};
  background: rgba(236, 253, 245, 0.92);
  border-color: rgba(16, 185, 129, 0.18);
  color: #047857;
`;
