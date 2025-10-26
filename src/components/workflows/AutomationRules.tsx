import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Circle, Code, Zap } from 'lucide-react';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  isActive: boolean;
  priority?: number;
  tags?: string[];
  lastExecuted?: string;
  executionCount?: number;
}

interface AutomationRulesProps {
  workflowId: string;
  rules?: AutomationRule[];
  onRuleChange?: (rules: AutomationRule[]) => void;
  isLoading?: boolean;
  error?: string;
}

const AutomationRules: React.FC<AutomationRulesProps> = ({
  workflowId,
  rules = [],
  onRuleChange = () => {},
  isLoading = false,
  error,
}) => {
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRule = () => {
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: '',
      description: '',
      condition: '',
      action: '',
      isActive: true,
      priority: rules.length + 1,
      tags: [],
      executionCount: 0,
    };
    setEditingRule(newRule);
    setIsAddingRule(true);
  };

  const handleSaveRule = (rule: AutomationRule) => {
    if (isAddingRule) {
      onRuleChange([...rules, rule]);
    } else {
      onRuleChange(rules.map(r => r.id === rule.id ? rule : r));
    }
    setEditingRule(null);
    setIsAddingRule(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setDeleteConfirmation(null);
    onRuleChange(rules.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    onRuleChange(
      rules.map(r => 
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Error loading automation rules</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Automation Rules</h2>
            <p className="text-sm text-gray-500">
              Create and manage your workflow automation rules
            </p>
          </div>
          <button
            onClick={handleAddRule}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredRules.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-indigo-100 p-3 mx-auto w-fit">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No automation rules</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'No rules match your search criteria.' : 'Get started by creating your first automation rule.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddRule}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{rule.name}</h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Circle className="w-2 h-2 mr-1" fill={rule.isActive ? 'currentColor' : 'none'} />
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {rule.priority && (
                        <span className="ml-2 text-xs text-gray-500">
                          Priority: {rule.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingRule(rule)}
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-1 rounded-full ${
                        rule.isActive
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Circle className="w-4 h-4" fill={rule.isActive ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(rule.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="col-span-1 bg-gray-50 rounded-md p-3">
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <Code className="w-4 h-4 mr-2" />
                      <span className="font-medium">Condition</span>
                    </div>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {rule.condition}
                    </pre>
                  </div>
                  <div className="col-span-1 bg-gray-50 rounded-md p-3">
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <Zap className="w-4 h-4 mr-2" />
                      <span className="font-medium">Action</span>
                    </div>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {rule.action}
                    </pre>
                  </div>
                </div>
                {rule.lastExecuted && (
                  <div className="mt-3 text-xs text-gray-500">
                    Last executed: {new Date(rule.lastExecuted).toLocaleString()} 
                    {rule.executionCount !== undefined && ` · ${rule.executionCount} executions`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rule Editor Modal */}
      {(editingRule || isAddingRule) && (
        <RuleEditor
          rule={editingRule || {
            id: `rule-${Date.now()}`,
            name: '',
            description: '',
            condition: '',
            action: '',
            isActive: true,
            priority: rules.length + 1,
            tags: [],
            executionCount: 0,
          }}
          onSave={handleSaveRule}
          onCancel={() => {
            setEditingRule(null);
            setIsAddingRule(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Rule</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this automation rule? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRule(deleteConfirmation)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


interface RuleEditorProps {
  rule: AutomationRule;
  onSave: (rule: AutomationRule) => void;
  onCancel: () => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onSave, onCancel }) => {
  const [editedRule, setEditedRule] = useState<AutomationRule>(rule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRule);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {rule.id ? 'Edit Rule' : 'Create Rule'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editedRule.name}
              onChange={(e) => setEditedRule({...editedRule, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={editedRule.description}
              onChange={(e) => setEditedRule({...editedRule, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <textarea
              value={editedRule.condition}
              onChange={(e) => setEditedRule({...editedRule, condition: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <textarea
              value={editedRule.action}
              onChange={(e) => setEditedRule({...editedRule, action: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutomationRules;
