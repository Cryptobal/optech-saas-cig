---------------------------
-- MÓDULO BASE (TENANTS)
---------------------------
-- Este módulo es la base del sistema multiempresa. Cada tenant representa una empresa de seguridad
-- que utilizará el sistema. Contiene la configuración base y el plan de suscripción.

CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    configuracion JSONB, -- Configuraciones específicas de la empresa
    plan_subscripcion VARCHAR(50), -- Plan contratado (Basic, Premium, Enterprise)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX idx_tenants_rut ON tenants(rut);
CREATE INDEX idx_tenants_estado ON tenants(estado);

---------------------------
-- MÓDULO USUARIOS Y PERMISOS
---------------------------
-- Gestiona los usuarios del sistema y sus permisos

CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    estado BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_usuario_email_unique UNIQUE (tenant_id, email),
    CONSTRAINT tenant_usuario_rut_unique UNIQUE (tenant_id, rut)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_rol_nombre_unique UNIQUE (tenant_id, nombre)
);

CREATE TABLE permisos (
    id UUID PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles_permisos (
    rol_id UUID REFERENCES roles(id),
    permiso_id UUID REFERENCES permisos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE usuarios_roles (
    usuario_id UUID REFERENCES usuarios(id),
    rol_id UUID REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, rol_id)
);

-- Índices para usuarios y permisos
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tenant ON usuarios(tenant_id);
CREATE INDEX idx_roles_tenant ON roles(tenant_id);

---------------------------
-- MÓDULO AUDITORÍA
---------------------------
-- Registra todas las acciones importantes en el sistema

CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    usuario_id UUID REFERENCES usuarios(id),
    accion VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para auditoría
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_usuario ON audit_log(usuario_id);
CREATE INDEX idx_audit_log_tabla ON audit_log(tabla_afectada);
CREATE INDEX idx_audit_log_fecha ON audit_log(created_at);

---------------------------
-- MÓDULO CLIENTES
---------------------------
-- Gestiona los clientes de cada empresa de seguridad (tenant).
-- Un cliente puede tener múltiples instalaciones y contratos.

CREATE TABLE clientes (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id), -- Empresa de seguridad a la que pertenece
    rut VARCHAR(12) NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    representante_legal_nombre VARCHAR(255) NOT NULL,
    representante_legal_rut VARCHAR(12) NOT NULL,
    direccion_fiscal TEXT,
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    region VARCHAR(100),
    telefono VARCHAR(20),
    email_principal VARCHAR(255),
    estado BOOLEAN DEFAULT true,
    fecha_inicio_contrato DATE NOT NULL,
    fecha_fin_contrato DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_cliente_rut_unique UNIQUE (tenant_id, rut)
);

-- Documentos asociados a cada cliente (contratos, anexos, etc.)
CREATE TABLE cliente_documentos (
    id UUID PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    tipo_documento VARCHAR(50),
    nombre_archivo VARCHAR(255) NOT NULL,
    url_documento VARCHAR(512) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contactos de cada cliente para comunicación
CREATE TABLE cliente_contactos (
    id UUID PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    nombre VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(20),
    es_contacto_principal BOOLEAN DEFAULT false,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------
-- MÓDULO INSTALACIONES
---------------------------
-- Gestiona las ubicaciones físicas donde se prestan servicios de seguridad.
-- Cada instalación pertenece a un único cliente y puede tener múltiples roles de servicio.

CREATE TABLE instalaciones (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    cliente_id UUID REFERENCES clientes(id),
    nombre VARCHAR(255) NOT NULL,
    codigo_interno VARCHAR(50),
    valor_turno_extra DECIMAL(10,2),
    direccion TEXT NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    referencia_direccion TEXT,
    estado BOOLEAN DEFAULT true,
    tipo_instalacion VARCHAR(50),
    metros_cuadrados DECIMAL(10,2),
    cantidad_accesos INTEGER,
    requiere_rondas BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_instalacion_codigo_unique UNIQUE (tenant_id, codigo_interno),
    ubicacion geography(Point)
);

-- Documentos específicos de cada instalación (planos, protocolos, etc.)
CREATE TABLE instalacion_documentos (
    id UUID PRIMARY KEY,
    instalacion_id UUID REFERENCES instalaciones(id),
    tipo_documento VARCHAR(50),
    nombre_archivo VARCHAR(255) NOT NULL,
    url_documento VARCHAR(512) NOT NULL,
    fecha_vigencia_inicio DATE,
    fecha_vigencia_fin DATE,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------
-- MÓDULO TURNOS Y ROLES
---------------------------
-- Define los tipos de turnos disponibles y los roles de servicio en cada instalación.
-- Un rol de servicio puede requerir múltiples tipos de turnos.

CREATE TABLE shift_types (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(100) NOT NULL, -- Ej: "4x4x12", "5x2x8"
    dias_trabajo INTEGER NOT NULL,
    dias_descanso INTEGER NOT NULL,
    horas_por_dia DECIMAL(4,2) NOT NULL,
    modo_turno VARCHAR(20) NOT NULL CHECK (modo_turno IN ('Día', 'Noche', 'Rotativo')),
    guardias_minimos_requeridos INTEGER NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_shift_type_unique UNIQUE (tenant_id, nombre)
);

-- Índices para turnos
CREATE INDEX idx_shift_types_tenant ON shift_types(tenant_id);
CREATE INDEX idx_shift_types_estado ON shift_types(estado);

-- Roles de servicio definidos para cada instalación
CREATE TABLE service_roles (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cobertura_24_7 BOOLEAN DEFAULT false,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_service_role_nombre_unique UNIQUE (tenant_id, instalacion_id, nombre)
);

-- Relación entre roles de servicio y tipos de turno
CREATE TABLE service_role_shifts (
    id UUID PRIMARY KEY,
    service_role_id UUID REFERENCES service_roles(id),
    shift_type_id UUID REFERENCES shift_types(id),
    guardias_requeridos INTEGER NOT NULL CHECK (guardias_requeridos > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT service_role_shift_unique UNIQUE (service_role_id, shift_type_id)
);

---------------------------
-- MÓDULO GUARDIAS
---------------------------
-- Gestiona toda la información de los guardias de seguridad.
-- Incluye datos personales, laborales y documentación.

-- Tabla principal de guardias
CREATE TABLE guardias (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    rut VARCHAR(12) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    nacionalidad_id UUID REFERENCES paises(id),
    fecha_contrato DATE NOT NULL,
    fecha_termino_contrato DATE,
    direccion TEXT NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    afp_id UUID REFERENCES afps(id),
    sistema_salud_id UUID REFERENCES sistemas_salud(id),
    banco_id UUID REFERENCES bancos(id),
    tipo_cuenta_id UUID REFERENCES tipos_cuenta_bancaria(id),
    numero_cuenta VARCHAR(50),
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_guardia_rut_unique UNIQUE (tenant_id, rut),
    ubicacion geography(Point)
);

-- Relación histórica entre guardias e instalaciones, incluyendo el tipo de turno
CREATE TABLE guardias_instalaciones (
  id UUID PRIMARY KEY,
  guardia_id UUID REFERENCES guardias(id),
  instalacion_id UUID REFERENCES instalaciones(id),
  shift_type_id UUID REFERENCES shift_types(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de referencia para datos del guardia
CREATE TABLE paises (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_iso VARCHAR(3) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE afps (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sistemas_salud (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ISAPRE', 'FONASA')),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bancos (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tipos_cuenta_bancaria (
    id UUID PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentos del guardia (OS10, contratos, etc.)
CREATE TABLE guardia_documentos (
    id UUID PRIMARY KEY,
    guardia_id UUID REFERENCES guardias(id),
    tipo_documento VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_documento VARCHAR(512) NOT NULL,
    fecha_vigencia_inicio DATE,
    fecha_vigencia_fin DATE,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------
-- MÓDULO PAUTAS Y ASISTENCIA
---------------------------
-- Gestiona la planificación de turnos y el control de asistencia.
-- Incluye pautas mensuales, diarias y turnos programados.

CREATE TABLE pautas_mensuales (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio INTEGER NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('BORRADOR', 'PUBLICADA', 'CERRADA')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generada_automaticamente BOOLEAN DEFAULT false,
);

CREATE TABLE pautas_diarias (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'CERRADA')),
    pauta_mensual_id UUID REFERENCES pautas_mensuales(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pauta_diaria_unique UNIQUE (tenant_id, instalacion_id, fecha)
);

CREATE TABLE turnos_programados (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    pauta_diaria_id UUID REFERENCES pautas_diarias(id),
    service_role_shift_id UUID REFERENCES service_role_shifts(id),
    guardia_id UUID REFERENCES guardias(id),
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PROGRAMADO', 'PPC', 'CUBIERTO', 'ASISTIDO', 'INASISTENCIA')),
    hora_inicio TIMESTAMP NOT NULL,
    hora_fin TIMESTAMP NOT NULL,
    tipo_turno VARCHAR(20) DEFAULT 'NORMAL' CHECK (tipo_turno IN ('NORMAL', 'EXTRA', 'REEMPLAZO')),
    observaciones TEXT,
    es_turno_extra BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Turnos adicionales fuera de la planificación normal.
-- Puede ser con guardia propio o guardia externo.

CREATE TABLE turnos_extras (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    turno_programado_id UUID REFERENCES turnos_programados(id),
    guardia_id UUID REFERENCES guardias(id),
    es_guardia_externo BOOLEAN DEFAULT false,
    nombre_guardia_externo VARCHAR(255),
    rut_guardia_externo VARCHAR(12),
    telefono_guardia_externo VARCHAR(20),
    hora_inicio_real TIMESTAMP,
    hora_fin_real TIMESTAMP,
    monto_pago DECIMAL(10,2),
    estado_pago VARCHAR(50) NOT NULL CHECK (estado_pago IN ('PENDIENTE', 'PROCESADO', 'PAGADO')),
    fecha_pago DATE,
    referencia_pago VARCHAR(100),
    autorizado_por UUID REFERENCES usuarios(id),
    motivo TEXT NOT NULL,
    prioridad VARCHAR(20) CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'URGENTE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para turnos extras
CREATE INDEX idx_turnos_extras_tenant ON turnos_extras(tenant_id);
CREATE INDEX idx_turnos_extras_guardia ON turnos_extras(guardia_id);
CREATE INDEX idx_turnos_extras_fecha ON turnos_extras(hora_inicio_real);

---------------------------
-- MÓDULO ASISTENCIA BIOMÉTRICA
---------------------------
-- Gestiona el control de asistencia mediante múltiples métodos de verificación

CREATE TABLE metodos_verificacion (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    requiere_geolocalizacion BOOLEAN DEFAULT true,
    radio_permitido_metros INTEGER,
    requiere_imagen BOOLEAN DEFAULT true,
    requiere_codigo_qr BOOLEAN DEFAULT false,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_metodo_codigo_unique UNIQUE (tenant_id, codigo)
);

CREATE TABLE templates_biometricos (
    id UUID PRIMARY KEY,
    guardia_id UUID REFERENCES guardias(id),
    metodo_verificacion_id UUID REFERENCES metodos_verificacion(id),
    template_data BYTEA NOT NULL,
    fecha_registro TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registros_biometricos (
    id UUID,
    tenant_id UUID REFERENCES tenants(id),
    guardia_id UUID REFERENCES guardias(id),
    turno_programado_id UUID REFERENCES turnos_programados(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    metodo_verificacion_id UUID REFERENCES metodos_verificacion(id),
    tipo_registro VARCHAR(20) NOT NULL CHECK (tipo_registro IN ('ENTRADA', 'SALIDA')),
    fecha_hora TIMESTAMP NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    ubicacion geography(Point) NOT NULL,
    distancia_instalacion_metros INTEGER,
    dispositivo_origen VARCHAR(50),
    sistema_operativo VARCHAR(50),
    version_app VARCHAR(50),
    ip_dispositivo VARCHAR(45),
    estado_verificacion VARCHAR(20) NOT NULL CHECK (estado_verificacion IN ('VERIFICADO', 'RECHAZADO', 'MANUAL', 'PENDIENTE')),
    confidence_score DECIMAL(5,2),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (fecha_hora);

CREATE TABLE registros_biometricos_y2024m01 PARTITION OF registros_biometricos
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE registros_biometricos_y2024m02 PARTITION OF registros_biometricos
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE evidencias_verificacion (
    id UUID PRIMARY KEY,
    registro_biometrico_id UUID REFERENCES registros_biometricos(id),
    tipo_evidencia VARCHAR(50) NOT NULL CHECK (tipo_evidencia IN ('IMAGEN_ROSTRO', 'CODIGO_QR', 'FOTO_UBICACION', 'VIDEO')),
    url_evidencia VARCHAR(512) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verificaciones_manuales (
    id UUID PRIMARY KEY,
    registro_biometrico_id UUID REFERENCES registros_biometricos(id),
    usuario_id UUID REFERENCES usuarios(id),
    motivo VARCHAR(255) NOT NULL,
    observaciones TEXT,
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('APROBAR', 'RECHAZAR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alertas_asistencia (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    guardia_id UUID REFERENCES guardias(id),
    turno_programado_id UUID REFERENCES turnos_programados(id),
    tipo_alerta VARCHAR(50) NOT NULL CHECK (tipo_alerta IN ('FALTA_ENTRADA', 'FALTA_SALIDA', 'UBICACION_INCORRECTA', 'VERIFICACION_FALLIDA')),
    severidad VARCHAR(20) NOT NULL CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'RESUELTA', 'CERRADA')),
    fecha_alerta TIMESTAMP NOT NULL,
    fecha_resolucion TIMESTAMP,
    resuelto_por UUID REFERENCES usuarios(id),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para asistencia biométrica
CREATE INDEX idx_registros_biometricos_guardia ON registros_biometricos(guardia_id);
CREATE INDEX idx_registros_biometricos_fecha ON registros_biometricos(fecha_hora);
CREATE INDEX idx_registros_biometricos_instalacion ON registros_biometricos(instalacion_id);
CREATE INDEX idx_registros_biometricos_estado ON registros_biometricos(estado_verificacion);
CREATE INDEX idx_alertas_asistencia_estado ON alertas_asistencia(estado);
CREATE INDEX idx_alertas_asistencia_fecha ON alertas_asistencia(fecha_alerta);

-- Índices espaciales
CREATE INDEX idx_registros_biometricos_ubicacion ON registros_biometricos USING GIST (ubicacion);

---------------------------
-- MÓDULO FIRMA DIGITAL
---------------------------
-- Gestiona la documentación electrónica y firmas digitales con soporte para múltiples tipos de documentos

CREATE TABLE tipos_documento (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    requiere_firma BOOLEAN DEFAULT true,
    plantilla_url VARCHAR(512),
    campos_requeridos JSONB,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_tipo_doc_codigo_unique UNIQUE (tenant_id, codigo)
);

CREATE TABLE documentos_electronicos (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    tipo_documento_id UUID REFERENCES tipos_documento(id),
    entidad_tipo VARCHAR(50) NOT NULL CHECK (entidad_tipo IN ('GUARDIA', 'CLIENTE', 'INSTALACION')),
    entidad_id UUID NOT NULL,
    numero_documento VARCHAR(50),
    version INTEGER NOT NULL DEFAULT 1,
    fecha_emision DATE NOT NULL,
    fecha_inicio_vigencia DATE NOT NULL,
    fecha_fin_vigencia DATE,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('BORRADOR', 'PENDIENTE_FIRMA', 'FIRMADO', 'RECHAZADO', 'VENCIDO')),
    url_documento VARCHAR(512) NOT NULL,
    hash_documento VARCHAR(256) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE firmantes_documento (
    id UUID PRIMARY KEY,
    documento_id UUID REFERENCES documentos_electronicos(id),
    tipo_firmante VARCHAR(50) NOT NULL CHECK (tipo_firmante IN ('EMPLEADOR', 'TRABAJADOR', 'CLIENTE', 'REPRESENTANTE')),
    usuario_id UUID REFERENCES usuarios(id),
    orden_firma INTEGER NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'FIRMADO', 'RECHAZADO')),
    fecha_limite_firma TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT documento_firmante_orden_unique UNIQUE (documento_id, orden_firma)
);

CREATE TABLE firmas_electronicas (
    id UUID PRIMARY KEY,
    documento_id UUID REFERENCES documentos_electronicos(id),
    firmante_id UUID REFERENCES firmantes_documento(id),
    fecha_firma TIMESTAMP NOT NULL,
    ip_firma VARCHAR(45) NOT NULL,
    user_agent TEXT,
    certificado_firma TEXT NOT NULL,
    hash_firma VARCHAR(256) NOT NULL,
    sello_temporal VARCHAR(512),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_documento (
    id UUID PRIMARY KEY,
    documento_id UUID REFERENCES documentos_electronicos(id),
    version INTEGER NOT NULL,
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('CREACION', 'MODIFICACION', 'FIRMA', 'RECHAZO', 'VENCIMIENTO')),
    usuario_id UUID REFERENCES usuarios(id),
    descripcion TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificaciones_firma (
    id UUID PRIMARY KEY,
    documento_id UUID REFERENCES documentos_electronicos(id),
    firmante_id UUID REFERENCES firmantes_documento(id),
    tipo_notificacion VARCHAR(50) NOT NULL CHECK (tipo_notificacion IN ('PENDIENTE', 'RECORDATORIO', 'VENCIMIENTO')),
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'ENVIADA', 'LEIDA')),
    fecha_envio TIMESTAMP,
    fecha_lectura TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para firma digital
CREATE INDEX idx_documentos_entidad ON documentos_electronicos(entidad_tipo, entidad_id);
CREATE INDEX idx_documentos_estado ON documentos_electronicos(estado);
CREATE INDEX idx_firmantes_documento ON firmantes_documento(documento_id, estado);
CREATE INDEX idx_firmas_electronicas ON firmas_electronicas(documento_id);
CREATE INDEX idx_historial_documento ON historial_documento(documento_id);
CREATE INDEX idx_notificaciones_firma ON notificaciones_firma(documento_id, firmante_id);

---------------------------
-- MÓDULO API Y WEBHOOKS
---------------------------
-- Gestiona la integración con sistemas externos mediante APIs y webhooks.

CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(255) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    api_secret VARCHAR(256) NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_expiracion TIMESTAMP,
    ip_whitelist TEXT[],
    rate_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_apikey_nombre_unique UNIQUE (tenant_id, nombre)
);

CREATE TABLE api_permisos (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT api_permiso_codigo_unique UNIQUE (codigo)
);

CREATE TABLE api_keys_permisos (
    api_key_id UUID REFERENCES api_keys(id),
    permiso_id UUID REFERENCES api_permisos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (api_key_id, permiso_id)
);

CREATE TABLE api_logs (
    id UUID PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id),
    endpoint VARCHAR(255) NOT NULL,
    metodo VARCHAR(10) NOT NULL,
    ip_origen VARCHAR(45) NOT NULL,
    request_headers JSONB,
    request_body JSONB,
    response_code INTEGER,
    response_body JSONB,
    tiempo_respuesta INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhooks (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    secret_key VARCHAR(256) NOT NULL,
    estado BOOLEAN DEFAULT true,
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_webhook_nombre_unique UNIQUE (tenant_id, nombre)
);

CREATE TABLE webhook_eventos (
    id UUID PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ejemplo_payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT webhook_evento_codigo_unique UNIQUE (codigo)
);

CREATE TABLE webhook_suscripciones (
    webhook_id UUID REFERENCES webhooks(id),
    evento_id UUID REFERENCES webhook_eventos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (webhook_id, evento_id)
);

CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY,
    webhook_id UUID REFERENCES webhooks(id),
    evento_id UUID REFERENCES webhook_eventos(id),
    payload JSONB NOT NULL,
    intentos INTEGER DEFAULT 0,
    ultimo_codigo_respuesta INTEGER,
    ultima_respuesta TEXT,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE', 'ENVIADO', 'ERROR', 'CANCELADO')),
    siguiente_reintento TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------
-- MÓDULO DOCUMENTOS
---------------------------
-- Gestiona versiones de documentos y su historial

CREATE TABLE documentos (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    tipo_entidad VARCHAR(50) NOT NULL, -- 'CLIENTE', 'INSTALACION', 'GUARDIA'
    entidad_id UUID NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_documento VARCHAR(512) NOT NULL,
    hash_documento VARCHAR(256) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    es_version_actual BOOLEAN DEFAULT true,
    creado_por UUID REFERENCES usuarios(id),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documento_versiones (
    id UUID PRIMARY KEY,
    documento_id UUID REFERENCES documentos(id),
    version INTEGER NOT NULL,
    url_documento VARCHAR(512) NOT NULL,
    hash_documento VARCHAR(256) NOT NULL,
    cambios TEXT,
    creado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para documentos
CREATE INDEX idx_documentos_entidad ON documentos(entidad_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_documento);
CREATE INDEX idx_documentos_version ON documentos(version);

---------------------------
-- MÓDULO NOTIFICACIONES
---------------------------
-- Gestiona el sistema de notificaciones y alertas

CREATE TABLE notificaciones (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    prioridad VARCHAR(20) CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'URGENTE')),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE', 'ENVIADA', 'LEIDA', 'ARCHIVADA')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificaciones_usuarios (
    notificacion_id UUID REFERENCES notificaciones(id),
    usuario_id UUID REFERENCES usuarios(id),
    leida BOOLEAN DEFAULT false,
    fecha_leida TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notificacion_id, usuario_id)
);

CREATE TABLE notificaciones_config (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    usuario_id UUID REFERENCES usuarios(id),
    tipo_notificacion VARCHAR(50) NOT NULL,
    canal VARCHAR(20) NOT NULL CHECK (canal IN ('EMAIL', 'SMS', 'PUSH', 'WEB')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notificacion_config_unique UNIQUE (tenant_id, usuario_id, tipo_notificacion, canal)
);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_tenant ON notificaciones(tenant_id);
CREATE INDEX idx_notificaciones_estado ON notificaciones(estado);
CREATE INDEX idx_notificaciones_fecha ON notificaciones(created_at);

---------------------------
-- MÓDULO GEOLOCALIZACIÓN
---------------------------
-- Extensión PostGIS para manejo de datos geográficos

CREATE EXTENSION IF NOT EXISTS postgis;

-- Modificación de tablas existentes para soporte geográfico
ALTER TABLE instalaciones 
ADD COLUMN ubicacion geography(Point);

ALTER TABLE guardias 
ADD COLUMN ubicacion geography(Point);

-- Tabla para zonas geográficas
CREATE TABLE zonas_geograficas (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    poligono geography(Polygon) NOT NULL,
    radio_metros INTEGER, -- Para zonas circulares
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices espaciales
CREATE INDEX idx_instalaciones_ubicacion ON instalaciones USING GIST (ubicacion);
CREATE INDEX idx_guardias_ubicacion ON guardias USING GIST (ubicacion);
CREATE INDEX idx_zonas_geograficas_poligono ON zonas_geograficas USING GIST (poligono);

---------------------------
-- MÓDULO SEGURIDAD
---------------------------
-- Implementación de políticas de seguridad a nivel de fila

-- Habilitar RLS en tablas principales
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE instalaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos_programados ENABLE ROW LEVEL SECURITY;

-- Políticas de aislamiento por tenant
CREATE POLICY tenant_isolation_clientes ON clientes
    FOR ALL
    TO authenticated
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_instalaciones ON instalaciones
    FOR ALL
    TO authenticated
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_guardias ON guardias
    FOR ALL
    TO authenticated
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_turnos ON turnos_programados
    FOR ALL
    TO authenticated
    USING (tenant_id = current_tenant_id());

-- Función para obtener el tenant actual
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política de retención de datos
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    tabla VARCHAR(100) NOT NULL,
    periodo_retencion INTEGER NOT NULL, -- en meses
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('ARCHIVAR', 'ELIMINAR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenant_tabla_unique UNIQUE (tenant_id, tabla)
);

---------------------------
-- MÓDULO RONDAS DE SEGURIDAD
---------------------------
-- Gestiona el sistema de rondas y patrullaje en las instalaciones

CREATE TABLE puntos_control (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo_qr VARCHAR(100) UNIQUE,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    ubicacion geography(Point) NOT NULL,
    orden INTEGER NOT NULL,
    tiempo_estimado_minutos INTEGER,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT instalacion_punto_orden_unique UNIQUE (instalacion_id, orden)
);

CREATE TABLE rutas_ronda (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    instalacion_id UUID REFERENCES instalaciones(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    frecuencia_horas INTEGER NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rutas_puntos_control (
    ruta_id UUID REFERENCES rutas_ronda(id),
    punto_control_id UUID REFERENCES puntos_control(id),
    orden INTEGER NOT NULL,
    tiempo_estimado_minutos INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ruta_id, punto_control_id),
    CONSTRAINT ruta_punto_orden_unique UNIQUE (ruta_id, orden)
);

CREATE TABLE rondas_programadas (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    ruta_id UUID REFERENCES rutas_ronda(id),
    guardia_id UUID REFERENCES guardias(id),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'INCOMPLETA', 'CANCELADA')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registros_ronda (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    ronda_programada_id UUID REFERENCES rondas_programadas(id),
    punto_control_id UUID REFERENCES puntos_control(id),
    guardia_id UUID REFERENCES guardias(id),
    fecha_hora TIMESTAMP NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    ubicacion geography(Point) NOT NULL,
    tipo_registro VARCHAR(20) NOT NULL CHECK (tipo_registro IN ('INICIO', 'CHECKPOINT', 'FIN')),
    observaciones TEXT,
    imagen_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (fecha_hora);

CREATE TABLE registros_ronda_y2024m01 PARTITION OF registros_ronda
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE registros_ronda_y2024m02 PARTITION OF registros_ronda
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE incidentes_ronda (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    registro_ronda_id UUID REFERENCES registros_ronda(id),
    tipo_incidente VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    severidad VARCHAR(20) NOT NULL CHECK (severidad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROGRESO', 'RESUELTO', 'CERRADO')),
    accion_tomada TEXT,
    fecha_resolucion TIMESTAMP,
    resuelto_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para rondas
CREATE INDEX idx_puntos_control_instalacion ON puntos_control(instalacion_id);
CREATE INDEX idx_rutas_ronda_instalacion ON rutas_ronda(instalacion_id);
CREATE INDEX idx_rondas_programadas_fecha ON rondas_programadas(fecha);
CREATE INDEX idx_registros_ronda_guardia ON registros_ronda(guardia_id);
CREATE INDEX idx_registros_ronda_fecha ON registros_ronda(fecha_hora);
CREATE INDEX idx_incidentes_ronda_estado ON incidentes_ronda(estado);

-- Índices espaciales
CREATE INDEX idx_puntos_control_ubicacion ON puntos_control USING GIST (ubicacion);
CREATE INDEX idx_registros_ronda_ubicacion ON registros_ronda USING GIST (ubicacion);
