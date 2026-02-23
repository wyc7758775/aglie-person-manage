import { useState, useMemo, useCallback } from 'react';
import { Requirement as BaseRequirement } from '@/app/lib/definitions';
import { ExtendedRequirement, convertToExtendedRequirement } from '../requirement-utils';

export function useRequirements(requirements: BaseRequirement[]) {
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [activePriorityFilter, setActivePriorityFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const extendedRequirements = useMemo(() => {
    return requirements.map(convertToExtendedRequirement);
  }, [requirements]);

  const filteredRequirements = useMemo(() => {
    return extendedRequirements.filter(req => {
      if (activeStatusFilter !== 'all' && req.status !== activeStatusFilter) return false;
      if (activePriorityFilter !== 'all' && req.priority !== activePriorityFilter) return false;
      return true;
    });
  }, [extendedRequirements, activeStatusFilter, activePriorityFilter]);

  const handleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(sid => sid !== id)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean, allIds: string[]) => {
    setSelectedIds(checked ? allIds : []);
  }, []);

  return {
    filteredRequirements,
    activeStatusFilter,
    setActiveStatusFilter,
    activePriorityFilter,
    setActivePriorityFilter,
    selectedIds,
    setSelectedIds,
    handleSelect,
    handleSelectAll,
  };
}
