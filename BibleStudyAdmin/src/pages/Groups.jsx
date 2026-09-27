import { useState } from 'react';
import { X, Users, ChevronLeft, ChevronRight, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { Avatar, ErrorState, ReaderSkeletonList } from '@/components/ui';
import { useGroupsContext } from '@/context/GroupsContext';

export default function Groups() {
  const {
    groups,
    loading,
    error,
    reload,
    selectedId,
    groupDetail,
    detailLoading,
    detailError,
    openGroup,
    closeGroup,
  } = useGroupsContext();
  const [showAssign, setShowAssign] = useState(false);
  const [swapTarget, setSwapTarget] = useState(null); // member being moved

  // Detail view: one group and its members
  if (selectedId) {
    return (
      <div className="page stack fade-in">
        <div className="page-head">
          <div className="detail-head">
            <button
              onClick={closeGroup}
              className="btn-ghost detail-back"
              aria-label="Back to groups"
            >
              <ChevronLeft className="icon-20" />
            </button>
            <div>
              <h2 className="page-title serif">{groupDetail?.name || 'Group'}</h2>
              <p className="page-sub">
                {detailLoading ? (
                  <span className="sk-line sk-sub" />
                ) : (
                  `${groupDetail?.readers?.length ?? 0} ${(groupDetail?.readers?.length ?? 0) === 1 ? 'member' : 'members'}`
                )}
              </p>
            </div>
          </div>
        </div>

        {detailLoading ? (
          <ReaderSkeletonList count={4} />
        ) : detailError ? (
          <ErrorState message={detailError} onRetry={() => openGroup(selectedId)} />
        ) : !groupDetail || groupDetail.readers.length === 0 ? (
          <div className="empty-block">
            <div className="empty-circle">
              <Users className="icon-32 empty-glyph" />
            </div>
            <p className="empty-title">No members in this group yet</p>
            <p className="empty-sub">Members appear here once readers are assigned</p>
          </div>
        ) : (
          <div className="list-tight">
            {groupDetail.readers.map((member) => (
              <div key={member.id} className="card row">
                <Avatar name={member.name} size={40} />
                <div className="row-main">
                  <p className="row-title truncate">{member.name}</p>
                  <p className="row-sub truncate">{member.phone_number || 'No phone'}</p>
                </div>
                <button
                  onClick={() => setSwapTarget(member)}
                  className="btn-ghost"
                  aria-label={`Move ${member.name} to another group`}
                  title="Move to another group"
                >
                  <ArrowLeftRight className="icon-20" />
                </button>
              </div>
            ))}
          </div>
        )}

        {swapTarget && (
          <SwapForm member={swapTarget} onClose={() => setSwapTarget(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="page stack fade-in">
      {/* Header */}
      <div className="page-head">
        <div>
          <h2 className="page-title serif">Groups</h2>
          <p className="page-sub">
            {loading ? (
              <span className="sk-line sk-sub" />
            ) : (
              <>
                {groups.length} {groups.length === 1 ? 'group' : 'groups'} · Readers are organised into groups by the bot
              </>
            )}
          </p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <ReaderSkeletonList />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : groups.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle">
            <Users className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">No groups yet</p>
          <p className="empty-sub">Tap Assign Members to split your readers into groups randomly</p>
          <button
            onClick={() => setShowAssign(true)}
            className="btn-primary btn-compact"
          >
            Assign Members
          </button>
        </div>
      ) : (
        <div className="list-tight">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => openGroup(group.id)}
              className="card row row-btn"
            >
              <Avatar name={group.name} size={44} />
              <div className="row-main">
                <p className="row-title truncate">{group.name}</p>
                <p className="row-sub truncate">
                  {group.readers_count} {group.readers_count === 1 ? 'reader' : 'readers'}
                </p>
              </div>
              <ChevronRight className="icon-16 row-chevron" />
            </button>
          ))}
        </div>
      )}

      {showAssign && <AssignForm onClose={() => setShowAssign(false)} />}
    </div>
  );
}

// Pick a different group for the selected member.
function SwapForm({ member, onClose }) {
  const { groups, groupDetail, swapMember } = useGroupsContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const options = groups.filter((g) => g.id !== groupDetail?.id);

  async function move(targetGroupId) {
    setSaving(true);
    setError('');
    try {
      await swapMember({
        groupId: groupDetail.id,
        readerId: member.id,
        targetGroupId,
      });
      onClose();
    } catch (err) {
      console.error('Failed to move reader:', err);
      setError(err.message || 'Failed to move this reader.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title serif">Move {member.name}</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="icon-20" />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle className="icon-16 form-error-icon" />
            {error}
          </div>
        )}

        {options.length === 0 ? (
          <p className="assign-hint">
            There are no other groups yet. Assign members first, then try again.
          </p>
        ) : (
          <div className="list-tight">
            {options.map((group) => (
              <button
                key={group.id}
                onClick={() => move(group.id)}
                disabled={saving}
                className="card row row-btn"
              >
                <Avatar name={group.name} size={40} />
                <div className="row-main">
                  <p className="row-title truncate">{group.name}</p>
                  <p className="row-sub truncate">
                    {group.readers_count} {group.readers_count === 1 ? 'reader' : 'readers'}
                  </p>
                </div>
                <ChevronRight className="icon-16 row-chevron" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={saving}
          className="btn-primary btn-block btn-save"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AssignForm({ onClose }) {
  const { assignMembers } = useGroupsContext();
  const [count, setCount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1) {
      setError('Enter a whole number of groups (1 or more).');
      return;
    }
    setSaving(true);
    setError('');

    try {
      await assignMembers({ count: n });
      onClose();
    } catch (err) {
      console.error('Failed to assign members:', err);
      setError(err.message || 'Failed to assign members.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div
        className="modal scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3 className="modal-title serif">Assign Members</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="icon-20" />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle className="icon-16 form-error-icon" />
            {error}
          </div>
        )}

        <div className="stack">
          <div>
            <label className="field-label">How many groups?</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g. 4"
              className="input"
            />
          </div>
          <p className="assign-hint">Readers will be distributed randomly across the groups.</p>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Assigning...' : 'Assign'}
        </button>
      </div>
    </div>
  );
}
