/**
 * Notifications Component - Toast notifications for sync events
 */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';
import htm from 'htm';
import { notifications, dismissNotification } from '../store.js';

const html = htm.bind(h);

const ICONS = {
    info: '\u2139\uFE0F',
    success: '\u2705',
    warning: '\u26A0\uFE0F',
    error: '\u274C'
};

function NotificationItem({ notification, onDismiss }) {
    const { id, type, title, message, action } = notification;

    const handleAction = () => {
        if (action?.handler) {
            action.handler();
        }
        onDismiss(id);
    };

    return html`
        <div class="notification notification-${type}">
            <div class="notification-icon">${ICONS[type] || ICONS.info}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                ${message && html`<div class="notification-message">${message}</div>`}
            </div>
            <div class="notification-actions">
                ${action && html`
                    <button class="notification-action-btn" onClick=${handleAction}>
                        ${action.label}
                    </button>
                `}
                <button class="notification-close" onClick=${() => onDismiss(id)}>
                    \u2715
                </button>
            </div>
        </div>
    `;
}

export function Notifications() {
    const [items, setItems] = useState(notifications.value);

    useEffect(() => {
        const dispose = effect(() => {
            setItems([...notifications.value]);
        });
        return dispose;
    }, []);

    if (items.length === 0) {
        return null;
    }

    return html`
        <div class="notifications-container">
            ${items.map(notification => html`
                <${NotificationItem}
                    key=${notification.id}
                    notification=${notification}
                    onDismiss=${dismissNotification}
                />
            `)}
        </div>
    `;
}
