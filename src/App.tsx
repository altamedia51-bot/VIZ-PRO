/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectManager } from './components/ProjectManager';
import { Editor } from './components/Editor';
import { Project } from './types';

export default function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (activeProject) {
    return (
      <Editor 
        project={activeProject} 
        onExit={() => setActiveProject(null)} 
      />
    );
  }

  return (
    <ProjectManager 
      onSelectProject={(project) => setActiveProject(project)} 
    />
  );
}

