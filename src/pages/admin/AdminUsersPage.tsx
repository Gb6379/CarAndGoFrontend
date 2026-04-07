import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../../services/authService';
import { getErrorMessage, errorToDisplay } from '../../utils/errorUtils';

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1a1d29;
  margin-bottom: 1rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: ${p => p.$active ? '#F6885C' : 'white'};
  color: ${p => p.$active ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: ${p => p.$active ? '#ED733A' : '#f5f5f5'};
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
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
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
  tr:hover td {
    background: #fafafa;
  }
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
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.85rem;
  background: white;
  cursor: pointer;
`;

const DocBtn = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #F6885C;
  background: #F6885C;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover {
    background: #ED733A;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #1a1d29;
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
  margin-top: 1.25rem;
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover { background: #eee; }
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
  createdAt?: string;
}

const AdminUsersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userTypeFromUrl = searchParams.get('userType') || '';
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState<string>(userTypeFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [docModalUser, setDocModalUser] = useState<UserRow | null>(null);
  const [loadingCnh, setLoadingCnh] = useState(false);
  const [loadingCac, setLoadingCac] = useState(false);

  useEffect(() => {
    if (userTypeFromUrl && userTypeFromUrl !== filter) setFilter(userTypeFromUrl);
  }, [userTypeFromUrl]);

  const load = (userType?: string) => {
    setLoading(true);
    adminService.getUsers(userType || undefined)
      .then((data: UserRow[]) => setUsers(Array.isArray(data) ? data : []))
      .catch((err: any) => setError(getErrorMessage(err, 'Erro ao carregar usuários')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const type = filter || (userTypeFromUrl || undefined);
    load(type);
  }, [filter, userTypeFromUrl]);

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUpdatingId(userId);
    adminService.updateUserStatus(userId, newStatus)
      .then(() => load(filter || undefined))
      .catch((err: any) => alert(err.response?.data?.message || 'Erro ao atualizar'))
      .finally(() => setUpdatingId(null));
  };

  const openDoc = (url: string | null) => {
    if (url) window.open(url, '_blank', 'noopener');
    else alert('Documento não encontrado.');
  };

  const handleVerCnh = (userId: string) => {
    setLoadingCnh(true);
    adminService.getUserCnhDocumentBlobUrl(userId)
      .then((url) => openDoc(url))
      .finally(() => setLoadingCnh(false));
  };

  const handleVerCac = (userId: string) => {
    setLoadingCac(true);
    adminService.getUserCacDocumentBlobUrl(userId)
      .then((url) => openDoc(url))
      .finally(() => setLoadingCac(false));
  };

  const userTypeLabel: Record<string, string> = { lessor: 'Locador', lessee: 'Locatário', both: 'Ambos' };

  return (
    <>
      <Title>Usuários</Title>
      <Filters>
        <FilterBtn $active={filter === ''} onClick={() => setFilter('')}>Todos</FilterBtn>
        <FilterBtn $active={filter === 'lessor'} onClick={() => setFilter('lessor')}>Locadores</FilterBtn>
        <FilterBtn $active={filter === 'lessee'} onClick={() => setFilter('lessee')}>Locatários</FilterBtn>
        <FilterBtn $active={filter === 'both'} onClick={() => setFilter('both')}>Ambos</FilterBtn>
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
              {users.map((u) => (
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
                    <DocBtn type="button" onClick={() => setDocModalUser(u)}>
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
            <ModalClose type="button" onClick={() => setDocModalUser(null)}>Fechar</ModalClose>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default AdminUsersPage;
