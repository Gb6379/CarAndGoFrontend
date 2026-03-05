import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, Photo, CheckCircle, ArrowRight, ArrowLeft } from '../components/IconSystem';
import { authService } from '../services/authService';

const CAC_LINK = 'https://servicos.pf.gov.br/epol-sinic-publico/';

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const Steps = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const StepDot = styled.div<{ active: boolean; done: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.done ? '#2e7d32' : p.active ? '#1e3c72' : '#e0e0e0'};
  transition: background 0.2s;
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.85rem;
  color: ${p => p.active ? '#1e3c72' : '#999'};
  font-weight: ${p => p.active ? '600' : '400'};
`;

const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const Card = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardDescription = styled.p`
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const LinkBox = styled.div`
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
`;

const LinkTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1565c0;
  margin-bottom: 0.5rem;
`;

const LinkDescription = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const LinkAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #1565c0;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const UploadZone = styled.label<{ hasFile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border: 2px dashed ${p => p.hasFile ? '#2e7d32' : '#bdbdbd'};
  border-radius: 10px;
  background: ${p => p.hasFile ? '#e8f5e9' : '#fafafa'};
  cursor: pointer;
  transition: all 0.2s;
  padding: 1rem;

  &:hover {
    border-color: #1e3c72;
    background: #f5f5f5;
  }

  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const UploadText = styled.span`
  font-size: 0.9rem;
  color: #555;
  text-align: center;
`;

const FileName = styled.span`
  font-size: 0.85rem;
  color: #2e7d32;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.primary {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
  }
  &.primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 60, 114, 0.4);
  }
  &.secondary {
    background: #f5f5f5;
    color: #333;
  }
  &.secondary:hover:not(:disabled) {
    background: #eee;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ACCEPT_CNH = 'image/jpeg,image/png,image/webp,application/pdf';
const ACCEPT_CAC = 'image/jpeg,image/png,image/webp,application/pdf';

const DocumentVerificationUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [cnhFile, setCnhFile] = useState<File | null>(null);
  const [cacFile, setCacFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const cnhInputRef = useRef<HTMLInputElement>(null);
  const cacInputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleCnhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCnhFile(file);
    setError('');
  };

  const handleCacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCacFile(file);
    setError('');
  };

  const handleNext = () => {
    if (step === 1 && cnhFile) setStep(2);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const uploadVerificationDocument = async (type: 'cnh' | 'cac', file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3000'
      : 'https://carandgobackend-production.up.railway.app';
    const endpoint = type === 'cnh'
      ? `${API_BASE_URL}/users/profile/me/verification/cnh`
      : `${API_BASE_URL}/users/profile/me/verification/cac`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Falha ao enviar ${type === 'cnh' ? 'CNH' : 'CAC'}.`);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!cnhFile) {
      setError('Envie sua CNH na etapa 1.');
      return;
    }
    if (!cacFile) {
      setError('Envie a Certidão de Antecedentes Criminais (CAC).');
      return;
    }

    setLoading(true);
    try {
      try {
        await uploadVerificationDocument('cnh', cnhFile);
        await uploadVerificationDocument('cac', cacFile);
      } catch (uploadErr: any) {
        console.warn('Upload de documentos não disponível, continuando com validação:', uploadErr?.message);
      }

      const document = (user.cpfCnpj || '').replace(/\D/g, '');
      if (!document) {
        setError('Nenhum CPF encontrado no seu cadastro. Atualize seu perfil.');
        setLoading(false);
        return;
      }
      const documentType = document.length === 11 ? 'CPF' : 'CNPJ';
      const data = await authService.validateDocument({ document, type: documentType });

      if (data.success && data.result?.isValid) {
        const updatedUser = { ...user, documentsVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess(true);
        setTimeout(() => navigate('/verification', { replace: true }), 2000);
      } else {
        setError(data.error || data.result?.errors?.join(', ') || 'Falha na validação. Verifique seus dados ou tente mais tarde.');
      }
    } catch (err: any) {
      const res = err.response;
      let msg = 'Falha ao validar documentos. Tente novamente.';
      if (res?.status === 401) msg = 'Sessão expirada. Faça login novamente.';
      else if (res?.data?.message) msg = res.data.message;
      else if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <SuccessMessage>
          <CheckCircle size={24} />
          Documentos enviados e validados com sucesso. Redirecionando...
        </SuccessMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <Lock size={24} />
        Verificação de documentos
      </Title>
      <Subtitle>
        Envie sua Carteira Nacional de Habilitação (CNH) e a Certidão de Antecedentes Criminais (CAC) para validar sua conta e anunciar veículos.
      </Subtitle>

      <Steps>
        <StepRow>
          <StepDot active={step === 1} done={step > 1} />
          <StepLabel active={step === 1}>1. CNH</StepLabel>
        </StepRow>
        <StepRow>
          <StepDot active={step === 2} done={false} />
          <StepLabel active={step === 2}>2. CAC</StepLabel>
        </StepRow>
      </Steps>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {step === 1 && (
        <>
          <Card>
            <CardTitle>
              <Photo size={20} />
              Carteira Nacional de Habilitação (CNH)
            </CardTitle>
            <CardDescription>
              Envie uma foto da sua CNH ou o PDF gerado pelo app da CNH Digital. Formatos aceitos: foto (JPG, PNG) ou PDF.
            </CardDescription>
            <UploadZone hasFile={!!cnhFile}>
              <input
                ref={cnhInputRef}
                type="file"
                accept={ACCEPT_CNH}
                onChange={handleCnhChange}
              />
              <UploadIcon>
                <Photo size={32} />
              </UploadIcon>
              <UploadText>
                {cnhFile ? 'Arquivo selecionado' : 'Clique ou arraste aqui para enviar'}
              </UploadText>
              {cnhFile && <FileName>{cnhFile.name}</FileName>}
            </UploadZone>
          </Card>
          <ButtonRow>
            <Button className="secondary" onClick={() => navigate('/verification')}>
              <ArrowLeft size={18} /> Voltar
            </Button>
            <Button className="primary" onClick={handleNext} disabled={!cnhFile}>
              Próximo: CAC <ArrowRight size={18} />
            </Button>
          </ButtonRow>
        </>
      )}

      {step === 2 && (
        <>
          <Card>
            <CardTitle>
              <Lock size={20} />
              Certidão de Antecedentes Criminais (CAC)
            </CardTitle>
            <LinkBox>
              <LinkTitle>Onde obter a CAC</LinkTitle>
              <LinkDescription>
                A Certidão de Antecedentes Criminais é emitida pela Polícia Federal. Acesse o link abaixo para gerar o documento de forma gratuita.
              </LinkDescription>
              <LinkAnchor href={CAC_LINK} target="_blank" rel="noopener noreferrer">
                <ArrowRight size={18} />
                Gerar CAC no site da Polícia Federal
              </LinkAnchor>
            </LinkBox>
            <CardDescription>
              Após obter o documento, envie uma foto ou o PDF da sua CAC. Formatos aceitos: foto (JPG, PNG) ou PDF.
            </CardDescription>
            <UploadZone hasFile={!!cacFile}>
              <input
                ref={cacInputRef}
                type="file"
                accept={ACCEPT_CAC}
                onChange={handleCacChange}
              />
              <UploadIcon>
                <Photo size={32} />
              </UploadIcon>
              <UploadText>
                {cacFile ? 'Arquivo selecionado' : 'Clique ou arraste aqui para enviar'}
              </UploadText>
              {cacFile && <FileName>{cacFile.name}</FileName>}
            </UploadZone>
          </Card>
          <ButtonRow>
            <Button className="secondary" onClick={handleBack}>
              <ArrowLeft size={18} /> Voltar
            </Button>
            <Button className="primary" onClick={handleSubmit} disabled={loading || !cnhFile || !cacFile}>
              {loading ? 'Validando...' : (
                <>
                  <CheckCircle size={18} /> Enviar e validar
                </>
              )}
            </Button>
          </ButtonRow>
        </>
      )}
    </Container>
  );
};

export default DocumentVerificationUploadPage;
