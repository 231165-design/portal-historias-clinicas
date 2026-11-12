// ============================================================
// COMPONENTE: Card
// ============================================================

function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-card transition-all duration-200 ${
        hover ? 'hover:shadow-card-hover hover:-translate-y-1' : ''
      } ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 dark:text-primary-400 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-bold text-gray-800 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTE: CardHeader
// ============================================================
Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

// ============================================================
// SUB-COMPONENTE: CardBody
// ============================================================
Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>;
};

// ============================================================
// SUB-COMPONENTE: CardFooter
// ============================================================
Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export default Card;