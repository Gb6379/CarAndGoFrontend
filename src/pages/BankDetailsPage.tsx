import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { CreditCard } from '../components/IconSystem';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.35rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SaveButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BankDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    bankAgency: '',
    bankAccount: '',
    bankAccountType: '',
    bankHolderName: '',
    bankHolderDocument: '',
    pixKey: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || !userData.id) {
      navigate('/login');
      return;
    }
    const userType = userData.userType;
    if (userType !== 'lessor' && userType !== 'both') {
      navigate('/dashboard');
      return;
    }
    authService.getProfile()
      .then((user: any) => {
        setFormData({
          bankName: user.bankName || '',
          bankAgency: user.bankAgency || '',
          bankAccount: user.bankAccount || '',
          bankAccountType: user.bankAccountType || '',
          bankHolderName: user.bankHolderName || '',
          bankHolderDocument: user.bankHolderDocument || '',
          pixKey: user.pixKey || '',
        });
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(formData);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      alert('Dados bancários salvos com sucesso.');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title><CreditCard size={28} /> Dados bancários</Title>
        <Subtitle>Carregando...</Subtitle>
      </Container>
    );
  }

  return (
    <Container>
      <Title><CreditCard size={28} /> Dados bancários</Title>
      <Subtitle>
        Informe onde você deseja receber os pagamentos das locações. Estes dados são usados apenas para repasse.
      </Subtitle>

      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome do banco</Label>
            <Input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Ex: Banco do Brasil, Nubank"
            />
          </FormGroup>
          <FormGroup>
            <Label>Agência</Label>
            <Input
              type="text"
              name="bankAgency"
              value={formData.bankAgency}
              onChange={handleChange}
              placeholder="Número da agência"
            />
          </FormGroup>
          <FormGroup>
            <Label>Conta</Label>
            <Input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              placeholder="Número da conta"
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo de conta</Label>
            <Select
              name="bankAccountType"
              value={formData.bankAccountType}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="checking">Conta corrente</option>
              <option value="savings">Poupança</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Nome do titular</Label>
            <Input
              type="text"
              name="bankHolderName"
              value={formData.bankHolderName}
              onChange={handleChange}
              placeholder="Nome completo do titular da conta"
            />
          </FormGroup>
          <FormGroup>
            <Label>CPF ou CNPJ do titular</Label>
            <Input
              type="text"
              name="bankHolderDocument"
              value={formData.bankHolderDocument}
              onChange={handleChange}
              placeholder="Apenas números"
            />
          </FormGroup>
          <FormGroup>
            <Label>Chave PIX (opcional)</Label>
            <Input
              type="text"
              name="pixKey"
              value={formData.pixKey}
              onChange={handleChange}
              placeholder="E-mail, CPF, telefone ou chave aleatória"
            />
          </FormGroup>
          <SaveButton type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar dados bancários'}
          </SaveButton>
        </form>
      </Card>
    </Container>
  );
};

export default BankDetailsPage;
