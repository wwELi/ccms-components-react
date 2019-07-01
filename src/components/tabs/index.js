import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import IconRaw from '../icon';

import './index.less';

const types = { TILE: 'tile', CARD: 'card' };
const Icon = React.memo(IconRaw);

export default class Tabs extends PureComponent {

    static propTypes = {
        defaultActiveKey: PropTypes.string,
        activeKey: PropTypes.string,
        activeClassName: PropTypes.string,
        type: PropTypes.string,
        onChange: PropTypes.func,
        onClose: PropTypes.func
    }

    static defaultProps = {
        defaultActiveKey: '',
        activeKey: '',
        activeClassName: 'active',
        type: types.CARD,
        onChange: () => {},
        onClose: () => {}
    }

    static types = types;

    static shouldChange(prevProps, nextProps) {
        const prevChildCount = React.Children.count(prevProps.children);
        const nextChildCount = React.Children.count(nextProps.children);
    
        // 1. 通过props指定activeKey时，更新state
        // 2. tabpanel的数量发生变化时, 更新state
        if ((prevProps.activeKey !== nextProps.activeKey) ||
            (prevProps.activeKey === nextProps.activeKey && prevChildCount !== nextChildCount)) {
            return true;
        }
        return false;
    }

    constructor(props) {
        super(props);
        const { defaultActiveKey, activeKey, children } = props;

        const childList = Array.isArray(children) ? children : [children];
        const activedKey = activeKey || defaultActiveKey || childList[0].key;

        this.state = {
            activedKey,
            prevProps: props
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        const { prevProps } = state;
        const shouldChange = Tabs.shouldChange(prevProps, nextProps);
        return shouldChange ? { activedKey: nextProps.activeKey, prevProps: nextProps } : null;
    }

    handleChange = key => () => {
        const { activedKey } = this.state;
        if (key === activedKey) { return; }  // change event, not click event

        this.setState({ 
            activedKey: key
        }, () => {
            this.props.onChange(key);
        });
    }

    handleClose = key => () => {
        this.props.onClose(key);
    }

    renderTabHeader(child, isActived) {
        const { type, activeClassName } = this.props;
        const { disabled, closable, tab } = child.props;
        const { key } = child;

        // class & style
        const className = cls(`tabs-item-${type}`, { [activeClassName]: !disabled && isActived, disabled });

        // render
        return (
            <span className={className} onClick={this.handleChange(key)} key={key}>
                {tab}
                {
                    isActived && closable && 
                    <span className="closable-wrapper">
                        <Icon type="close" className="closable" onClick={this.handleClose(key)}/>
                    </span>
                }
            </span>
        );
    }

    render() {
        const { children } = this.props;
        const { activedKey } = this.state;
        
        const headers = [];
        let panel;
        
        Children.forEach(children, child => {
            const isActived = child.key === activedKey;
            headers.push(this.renderTabHeader(child, isActived));
            if (isActived) { panel = child; }
        });

        return (
            <div className="tabs">
                <section className="tabs-header">{headers}</section>
                {panel}
            </div>
        );
    }
}

const Panel = React.memo(props => {
    return (
        <div className="tabpanel-container">
            {props.children}
        </div>
    );
});

Panel.defaultProps = {
    disabled: false,
    closable: false
}

Tabs.Panel = Panel;