/**
 * Action Svelte qui téléporte un élément dans document.body
 * pour échapper aux contextes d'empilement des parents (transform, backdrop-filter, overflow).
 */
export function portal(node, target = document.body) {
    let targetEl;
    if (typeof target === 'string') {
        targetEl = document.querySelector(target) ?? document.body;
    }
    else {
        targetEl = target;
    }
    targetEl.appendChild(node);
    return {
        update(newTarget) {
            if (typeof newTarget === 'string') {
                targetEl = document.querySelector(newTarget) ?? document.body;
            }
            else {
                targetEl = newTarget;
            }
            targetEl.appendChild(node);
        },
        destroy() {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        },
    };
}
