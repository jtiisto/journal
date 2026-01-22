/**
 * App - Main component and routing logic
 */
import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';
import htm from 'htm';
import { currentView, initializeStore, triggerSync } from './store.js';
import { Header } from './components/Header.js';
import { TrackerList } from './components/TrackerList.js';
import { ConfigScreen } from './components/ConfigScreen.js';
import { ConflictResolver } from './components/ConflictResolver.js';
import { Notifications } from './components/Notifications.js';

const html = htm.bind(h);

function LoadingScreen() {
    return html`
        <div class="empty-state">
            <div class="empty-state-icon">\u23F3</div>
            <p>Loading...</p>
        </div>
    `;
}

function App() {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('home');

    useEffect(() => {
        // Subscribe to view changes
        const dispose = effect(() => {
            setView(currentView.value);
        });
        return dispose;
    }, []);

    useEffect(() => {
        // Initialize store on mount
        initializeStore()
            .then(() => {
                setLoading(false);
                // Try to sync on startup
                triggerSync();
            })
            .catch(err => {
                console.error('Init error:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return html`<${LoadingScreen} />`;
    }

    return html`
        <${Header} />
        ${view === 'home' && html`<${TrackerList} />`}
        ${view === 'config' && html`<${ConfigScreen} />`}
        ${view === 'conflicts' && html`<${ConflictResolver} />`}
        <${Notifications} />
    `;
}

// Mount the app
render(html`<${App} />`, document.getElementById('app'));
