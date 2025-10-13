import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, Error as ErrorIcon, Lock, Schedule } from './IconSystem';

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin: 2rem 0;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const StatusContainer = styled.div<{ status: 'idle' | 'loading' | 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  background: ${props => {
    switch (props.status) {
      case 'loading': return '#e3f2fd';
      case 'success': return '#e8f5e8';
      case 'error': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'loading': return '#1976d2';
      case 'success': return '#2e7d32';
      case 'error': return '#c62828';
      default: return '#666';
    }
  }};
`;

const GovBrIntegration: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleGovBrAuth = async () => {
    setStatus('loading');
    setMessage('Redirecting to GOV.BR authentication...');

    try {
      // Generate state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      
      // Get authorization URL from backend
      const response = await fetch('http://localhost:3000/gov-br/auth-url', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.authUrl) {
        // Store state for verification
        localStorage.setItem('govBrState', state);
        
        // Redirect to GOV.BR
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get GOV.BR authorization URL');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to initiate GOV.BR authentication. Please try again.');
      console.error('GOV.BR auth error:', error);
    }
  };

  const handleDocumentValidation = async () => {
    setStatus('loading');
    setMessage('Validating document with GOV.BR...');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const document = user.cpfCnpj;

      if (!document) {
        throw new Error('No document found for validation');
      }

      const documentType = document.length === 11 ? 'CPF' : 'CNPJ';

      const response = await fetch('http://localhost:3000/gov-br/validate-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document,
          type: documentType,
        }),
      });

      const data = await response.json();

      if (data.success && data.result.isValid) {
        setStatus('success');
        setMessage('Document validated successfully with GOV.BR!');
      } else {
        setStatus('error');
        setMessage(data.result?.errors?.join(', ') || 'Document validation failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to validate document. Please try again.');
      console.error('Document validation error:', error);
    }
  };

  return (
    <Container>
      <Title>
        GOV.BR Integration
      </Title>
      
      <Description>
        Verify your identity and documents through the official Brazilian government platform 
        for enhanced security and faster approval.
      </Description>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button onClick={handleGovBrAuth}>
          <Lock size={16} /> Authenticate with GOV.BR
        </Button>
        
        <Button onClick={handleDocumentValidation}>
          <CheckCircle size={16} /> Validate Documents
        </Button>
      </div>

      {status !== 'idle' && (
        <StatusContainer status={status}>
          {status === 'loading' && <Schedule size={16} />}
          {status === 'success' && <CheckCircle size={16} />}
          {status === 'error' && <ErrorIcon size={16} />}
          {message}
        </StatusContainer>
      )}
    </Container>
  );
};

export default GovBrIntegration;
