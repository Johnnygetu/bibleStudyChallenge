import { useState } from 'react';
import { X, Users, ChevronLeft, ChevronRight, AlertCircle, ArrowLeftRight, Crown } from 'lucide-react';
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
  const [leaderTarget, setLeaderTarget] = useState(null); // member to promote/demote

  // Detail view: one group and its members
  if (selectedId) {
    const openGroupMeta = groups.find((g) => g.id === selectedId);
    const detailName = groupDetail?.name || openGroupMeta?.name || 'Group';

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
              <h2 className="page-title serif">{detailName}</h2>
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
            {groupDetail.readers.map((member) => {
              const isLeader = Boolean(member.pivot?.is_leader);
              return (
                <div key={member.id} className="card row">
                  <Avatar name={member.name} size={40} />
                  <div className="row-main">
                    <div className="row-headline">
                      <p className="row-title truncate">{member.name}</p>
                      {isLeader && (
                        <span className="pill-xs pill-leader">
                          <Crown className="icon-10" fill="currentColor" />
                          Leader
                        </span>
                      )}
                    </div>
                    <p className="row-sub truncate">{member.phone_number || 'No phone'}</p>
                  </div>
                  <button
                    onClick={() => setLeaderTarget(member)}
                    className={isLeader ? 'btn-ghost btn-leader-on' : 'btn-ghost'}
                    aria-label={
                      isLeader
                        ? `Remove ${member.name} as leader`
                        : `Make ${member.name} a leader`
                    }
                    title={isLeader ? 'Remove leader' : 'Make leader'}
                  >
                    <Crown className="icon-16" fill={isLeader ? 'currentColor' : 'none'} />
                  </button>
                  {!isLeader && (
                    <button
                      onClick={() => setSwapTarget(member)}
                      className="btn-ghost"
                      aria-label={`Move ${member.name} to another group`}
                      title="Move to another group"
                    >
                      <ArrowLeftRight className="icon-20" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {swapTarget && (
          <SwapForm member={swapTarget} onClose={() => setSwapTarget(null)} />
        )}
        {leaderTarget && (
          <LeaderConfirm member={leaderTarget} onClose={() => setLeaderTarget(null)} />
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

// Promote a member to group leader, or demote them back to a regular member.
function LeaderConfirm({ member, onClose }) {
  const { groupDetail, setLeader } = useGroupsContext();
  const isLeader = Boolean(member.pivot?.is_leader);
  const currentLeader = groupDetail?.readers?.find(
    (r) => r.pivot?.is_leader && r.id !== member.id,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setSaving(true);
    setError('');
    try {
      await setLeader({
        groupId: groupDetail.id,
        readerId: member.id,
        isLeader: !isLeader,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update leader:', err);
      setError(err.message || 'Failed to update the group leader.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title serif">{isLeader ? 'Remove Leader' : 'Make Leader'}</h3>
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
          <p className="assign-hint">
            {isLeader
              ? `${member.name} will no longer be the group leader and can be moved to another group again.`
              : currentLeader
                ? `${member.name} will replace ${currentLeader.name} as the group's leader — a group has only one leader. Leaders wear a crown and cannot be moved to another group.`
                : `${member.name} will be marked as a leader of ${groupDetail?.name}. Leaders wear a crown and cannot be moved to another group.`}
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary btn-block btn-save"
          >
            {saving ? 'Saving...' : isLeader ? 'Remove Leader' : 'Make Leader'}
          </button>
          <button onClick={onClose} disabled={saving} className="btn-ghost btn-block">
            Cancel
          </button>
        </div>
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
