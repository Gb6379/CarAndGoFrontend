import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../../services/authService';
import { getErrorMessage, errorToDisplay } from '../../utils/errorUtils';
import modernTheme from '../../styles/modernTheme';
import { glassPanelCss, secondaryButtonCss, titleCss } from '../../styles/modernPrimitives';

const Title = styled.h1`
  ${titleCss}
  font-size: 1.75rem;
  margin-bottom: 1rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.88rem;
  font-weight: 600;
`;

const FilterBtn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  border: 1px solid ${p => p.$active ? 'transparent' : 'rgba(15, 23, 42, 0.08)'};
  background: ${p => p.$active ? modernTheme.gradients.brand : 'rgba(255,255,255,0.72)'};
  color: ${p => p.$active ? 'white' : modernTheme.colors.inkSoft};
  cursor: pointer;
  font-size: 0.9rem;
  box-shadow: ${p => p.$active ? modernTheme.shadows.glow : 'none'};
  &:hover {
    background: ${p => p.$active ? modernTheme.gradients.brand : 'white'};
  }
`;

const TableWrap = styled.div`
  ${glassPanelCss}
  border-radius: 20px;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  th {
    background: rgba(255,255,255,0.72);
    font-weight: 600;
    color: ${modernTheme.colors.ink};
  }
  tr:hover td {
    background: rgba(255,255,255,0.58);
  }

  @media (max-width: 768px) {
    min-width: 520px;

    th, td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }
`;

const EmptyCell = styled.td`
  text-align: center !important;
  color: ${modernTheme.colors.inkSoft};
`;

const Badge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: ${p => p.$status === 'active' ? '#d1fae5' : p.$status === 'inactive' ? '#fee2e2' : p.$status === 'suspended' ? '#fef3c7' : '#e5e7eb'};
  color: ${p => p.$status === 'active' ? '#065f46' : p.$status === 'inactive' ? '#991b1b' : p.$status === 'suspended' ? '#92400e' : '#374151'};
`;

const Select = styled.select`
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 0.85rem;
  background: rgba(255,255,255,0.78);
  cursor: pointer;
`;

const DocBtn = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: ${modernTheme.radii.pill};
  border: 1px solid transparent;
  background: ${modernTheme.gradients.brand};
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: ${modernTheme.shadows.glow};
`;

const ApproveBtn = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  border: 1px solid transparent;
  background: ${modernTheme.gradients.brand};
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${modernTheme.shadows.glow};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 17, 31, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalBox = styled.div`
  ${glassPanelCss}
  border-radius: 24px;
  padding: 1.5rem 2rem;
  max-width: 420px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: ${modernTheme.colors.ink};
`;

const ModalDocRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  &:last-of-type { border-bottom: none; }
`;

const ModalClose = styled.button`
  ${secondaryButtonCss}
  margin-top: 1.25rem;
  width: 100%;
  padding: 0.6rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${modernTheme.colors.inkSoft};
`;

const ModalHint = styled.p`
  margin: 1rem 0 0;
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.92rem;
  line-height: 1.5;
`;

const SuccessMsg = styled.p`
  color: #047857;
  margin-top: 1rem;
`;

const ErrorMsg = styled.p`
  color: #c00;
  margin-top: 1rem;
`;

interface UserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: string;
  documentsVerified?: boolean;
  emailSent?: boolean;
  createdAt?: string;
}

const AdminUsersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userTypeFilter = searchParams.get('userType') || '';
  const statusFilter = searchParams.get('status') === 'pending' ? 'pending' : '';
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [docModalUser, setDocModalUser] = useState<UserRow | null>(null);
  const [loadingCnh, setLoadingCnh] = useState(false);
  const [loadingCac, setLoadingCac] = useState(false);
  const [viewedDocs, setViewedDocs] = useState({ cnh: false, cac: false });
  const [approvingDocs, setApprovingDocs] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);

  const updateFilters = ({ userType, status }: { userType?: string; status?: string }) => {
    const params = new URLSearchParams(searchParams);

    if (userType !== undefined) {
      if (userType) params.set('userType', userType);
      else params.delete('userType');
    }

    if (status !== undefined) {
      if (status) params.set('status', status);
      else params.delete('status');
    }

    setSearchParams(params);
  };

  const load = (userType?: string, status?: string) => {
    setLoading(true);
    setError(null);
    adminService.getUsers(userType || undefined, status || undefined)
      .then((data: UserRow[]) => setUsers(Array.isArray(data) ? data : []))
      .catch((err: any) => setError(getErrorMessage(err, 'Erro ao carregar usuários')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(userTypeFilter || undefined, statusFilter || undefined);
  }, [userTypeFilter, statusFilter]);

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUpdatingId(userId);
    adminService.updateUserStatus(userId, newStatus)
      .then(() => load(userTypeFilter || undefined, statusFilter || undefined))
      .catch((err: any) => alert(err.response?.data?.message || 'Erro ao atualizar'))
      .finally(() => setUpdatingId(null));
  };

  const openDocumentModal = (user: UserRow) => {
    setDocModalUser(user);
    setViewedDocs({ cnh: false, cac: false });
    setApprovalError(null);
    setApprovalSuccess(null);
  };

  const openDoc = (url: string | null) => {
    if (url) {
      window.open(url, '_blank', 'noopener');
      return true;
    }
    alert('Documento não encontrado.');
    return false;
  };

  const handleVerCnh = async (userId: string) => {
    setLoadingCnh(true);
    try {
      const url = await adminService.getUserCnhDocumentBlobUrl(userId);
      if (openDoc(url)) {
        setViewedDocs((current) => ({ ...current, cnh: true }));
      }
    } finally {
      setLoadingCnh(false);
    }
  };

  const handleVerCac = async (userId: string) => {
    setLoadingCac(true);
    try {
      const url = await adminService.getUserCacDocumentBlobUrl(userId);
      if (openDoc(url)) {
        setViewedDocs((current) => ({ ...current, cac: true }));
      }
    } finally {
      setLoadingCac(false);
    }
  };

  const handleApproveDocuments = async () => {
    if (!docModalUser) return;

    setApprovingDocs(true);
    setApprovalError(null);
    setApprovalSuccess(null);
    try {
      const updatedUser = await adminService.approveUserDocuments(docModalUser.id);
      setUsers((current) => {
        const nextUsers = current.map((user) => (
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        ));

        if (statusFilter === 'pending' && String(updatedUser.status || '').toLowerCase() !== 'pending') {
          return nextUsers.filter((user) => user.id !== updatedUser.id);
        }

        return nextUsers;
      });
      setDocModalUser((current) => (
        current && current.id === updatedUser.id ? { ...current, ...updatedUser } : current
      ));
      setApprovalSuccess(
        updatedUser.emailSent === false
          ? 'Usuário aprovado e ativado com sucesso, mas o e-mail não pôde ser enviado.'
          : 'Usuário aprovado, ativado e notificado por e-mail.'
      );
    } catch (err: any) {
      setApprovalError(getErrorMessage(err, 'Erro ao aprovar usuário'));
    } finally {
      setApprovingDocs(false);
    }
  };

  const userTypeLabel: Record<string, string> = { lessor: 'Locador', lessee: 'Locatário', both: 'Ambos' };
  const isCurrentUserPending = String(docModalUser?.status || '').toLowerCase() === 'pending';
  const canApproveCurrentUser = !!docModalUser && viewedDocs.cnh && viewedDocs.cac && isCurrentUserPending;
  const isShowingPendingOnly = statusFilter === 'pending';

  return (
    <>
      <Title>Usuários</Title>
      <Filters>
        <FilterGroup>
          <FilterLabel>Tipo:</FilterLabel>
          <FilterBtn $active={userTypeFilter === ''} onClick={() => updateFilters({ userType: '' })}>Todos</FilterBtn>
          <FilterBtn $active={userTypeFilter === 'lessor'} onClick={() => updateFilters({ userType: 'lessor' })}>Locadores</FilterBtn>
          <FilterBtn $active={userTypeFilter === 'lessee'} onClick={() => updateFilters({ userType: 'lessee' })}>Locatários</FilterBtn>
          <FilterBtn $active={userTypeFilter === 'both'} onClick={() => updateFilters({ userType: 'both' })}>Ambos</FilterBtn>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>Validação:</FilterLabel>
          <FilterBtn $active={statusFilter === ''} onClick={() => updateFilters({ status: '' })}>Todos</FilterBtn>
          <FilterBtn $active={statusFilter === 'pending'} onClick={() => updateFilters({ status: 'pending' })}>Por validar</FilterBtn>
        </FilterGroup>
      </Filters>

      {error && <ErrorMsg>{errorToDisplay(error)}</ErrorMsg>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Alterar status</th>
                <th>Documentos</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <EmptyCell colSpan={6}>
                    {isShowingPendingOnly
                      ? 'Nenhum cadastro pendente de validação encontrado.'
                      : 'Nenhum usuário encontrado para os filtros selecionados.'}
                  </EmptyCell>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{userTypeLabel[u.userType] || u.userType}</td>
                  <td><Badge $status={u.status}>{u.status}</Badge></td>
                  <td>
                    <Select
                      value={u.status}
                      disabled={!!updatingId}
                      onChange={(e) => handleStatusChange(u.id, e.target.value)}
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="pending">pending</option>
                      <option value="suspended">suspended</option>
                    </Select>
                  </td>
                  <td>
                    <DocBtn type="button" onClick={() => openDocumentModal(u)}>
                      Ver documentos
                    </DocBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      {docModalUser && (
        <ModalOverlay onClick={() => setDocModalUser(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Documentos de {docModalUser.firstName} {docModalUser.lastName}</ModalTitle>
            <ModalDocRow>
              <span>CNH</span>
              <DocBtn type="button" onClick={() => handleVerCnh(docModalUser.id)} disabled={loadingCnh}>
                {loadingCnh ? 'Abrindo...' : 'Ver CNH'}
              </DocBtn>
            </ModalDocRow>
            <ModalDocRow>
              <span>CAC (Antecedentes)</span>
              <DocBtn type="button" onClick={() => handleVerCac(docModalUser.id)} disabled={loadingCac}>
                {loadingCac ? 'Abrindo...' : 'Ver CAC'}
              </DocBtn>
            </ModalDocRow>
            <ModalHint>
              {!isCurrentUserPending
                ? 'Este usuário já saiu da fila pendente. Você ainda pode reabrir os documentos para conferência.'
                : viewedDocs.cnh && viewedDocs.cac
                  ? 'Documentos revisados. Você já pode aprovar o usuário.'
                  : 'Abra a CNH e a CAC para liberar a aprovação do usuário.'}
            </ModalHint>
            {approvalError && <ErrorMsg>{errorToDisplay(approvalError)}</ErrorMsg>}
            {approvalSuccess && <SuccessMsg>{approvalSuccess}</SuccessMsg>}
            <ApproveBtn
              type="button"
              onClick={handleApproveDocuments}
              disabled={!canApproveCurrentUser || approvingDocs}
            >
              {approvingDocs
                  ? 'Aprovando...'
                  : isCurrentUserPending
                    ? 'APROVAR'
                    : 'Usuário já aprovado'}
            </ApproveBtn>
            <ModalClose type="button" onClick={() => setDocModalUser(null)}>Fechar</ModalClose>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default AdminUsersPage;
