from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_file
import pandas as pd
import os
import io
from werkzeug.utils import secure_filename
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'csv', 'txt'}
DELIMITER_OPTIONS = {
    'comma': ',',
    'semicolon': ';',
    'tab': '\t',
    'pipe': '|'
}

FORMAT_OPTIONS = {
    'text': 'Texto',
    'number': 'Número',
    'currency': 'Moeda (R$)',
    'percentage': 'Porcentagem (%)',
    'date': 'Data',
    'datetime': 'Data e Hora',
    'boolean': 'Verdadeiro/Falso'
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def apply_formatting(value, format_type, column_name):
    if pd.isna(value) or value == '':
        return ''
    
    try:
        if format_type == 'number':
            return f"{float(value):,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        elif format_type == 'currency':
            return f"R$ {float(value):,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        elif format_type == 'percentage':
            return f"{float(value):.2f}%"
        elif format_type == 'date':
            if isinstance(value, str):
                # Tentar diferentes formatos de data
                for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y/%m/%d']:
                    try:
                        date_obj = datetime.strptime(value, fmt)
                        return date_obj.strftime('%d/%m/%Y')
                    except:
                        continue
            return str(value)
        elif format_type == 'datetime':
            if isinstance(value, str):
                for fmt in ['%Y-%m-%d %H:%M:%S', '%d/%m/%Y %H:%M:%S', '%Y-%m-%d %H:%M']:
                    try:
                        date_obj = datetime.strptime(value, fmt)
                        return date_obj.strftime('%d/%m/%Y %H:%M:%S')
                    except:
                        continue
            return str(value)
        elif format_type == 'boolean':
            if str(value).lower() in ['true', '1', 'sim', 'yes', 'verdadeiro']:
                return 'Sim'
            elif str(value).lower() in ['false', '0', 'não', 'no', 'falso']:
                return 'Não'
            return str(value)
        else:  # text
            return str(value)
    except:
        return str(value)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    delimiter_key = request.form.get('delimiter', 'comma')
    
    if file.filename == '':
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Salvar informações na sessão
        session['filename'] = filename
        session['delimiter'] = DELIMITER_OPTIONS[delimiter_key]
        
        return redirect(url_for('configure'))
    
    return redirect(url_for('index'))

@app.route('/configure')
def configure():
    if 'filename' not in session:
        return redirect(url_for('index'))
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], session['filename'])
        df = pd.read_csv(filepath, delimiter=session['delimiter'], nrows=5)
        
        columns = df.columns.tolist()
        sample_data = df.head().to_dict('records')
        
        return render_template('configure.html', 
                             columns=columns, 
                             sample_data=sample_data,
                             filename=session['filename'])
    except Exception as e:
        return f"Erro ao processar arquivo: {str(e)}"

@app.route('/format', methods=['POST'])
def format_data():
    if 'filename' not in session:
        return redirect(url_for('index'))
    
    selected_columns = request.json.get('columns', [])
    session['selected_columns'] = selected_columns
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], session['filename'])
        df = pd.read_csv(filepath, delimiter=session['delimiter'])
        
        # Detectar tipos de dados automaticamente
        column_types = {}
        for col in selected_columns:
            if col in df.columns:
                sample_values = df[col].dropna().head(10)
                
                # Tentar detectar o tipo
                detected_type = 'text'
                
                # Verificar se é numérico
                try:
                    pd.to_numeric(sample_values)
                    detected_type = 'number'
                except:
                    pass
                
                # Verificar se é data
                if detected_type == 'text':
                    for val in sample_values:
                        if isinstance(val, str):
                            for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']:
                                try:
                                    datetime.strptime(val, fmt)
                                    detected_type = 'date'
                                    break
                                except:
                                    continue
                        if detected_type == 'date':
                            break
                
                column_types[col] = detected_type
        
        return render_template('format.html', 
                             columns=selected_columns,
                             column_types=column_types,
                             format_options=FORMAT_OPTIONS,
                             filename=session['filename'])
    except Exception as e:
        return f"Erro ao processar dados: {str(e)}"

@app.route('/view', methods=['POST'])
def view_data():
    if 'filename' not in session or 'selected_columns' not in session:
        return redirect(url_for('index'))
    
    column_formats = request.json
    session['column_formats'] = column_formats
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], session['filename'])
        df = pd.read_csv(filepath, delimiter=session['delimiter'])
        
        # Filtrar apenas as colunas selecionadas
        selected_columns = session['selected_columns']
        df_filtered = df[selected_columns].copy()
        
        # Aplicar formatação
        for col in selected_columns:
            if col in column_formats:
                format_type = column_formats[col]
                df_filtered[col] = df_filtered[col].apply(
                    lambda x: apply_formatting(x, format_type, col)
                )
        
        # Converter para lista de dicionários para o template
        data = df_filtered.to_dict('records')
        
        return render_template('view.html',
                             columns=selected_columns,
                             data=data,
                             total_rows=len(data),
                             filename=session['filename'])
    except Exception as e:
        return f"Erro ao processar dados: {str(e)}"

@app.route('/export/<format_type>')
def export_data(format_type):
    if 'filename' not in session or 'selected_columns' not in session:
        return redirect(url_for('index'))
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], session['filename'])
        df = pd.read_csv(filepath, delimiter=session['delimiter'])
        
        # Filtrar e formatar dados
        selected_columns = session['selected_columns']
        column_formats = session.get('column_formats', {})
        
        df_filtered = df[selected_columns].copy()
        
        # Aplicar formatação
        for col in selected_columns:
            if col in column_formats:
                format_type_col = column_formats[col]
                df_filtered[col] = df_filtered[col].apply(
                    lambda x: apply_formatting(x, format_type_col, col)
                )
        
        # Criar arquivo de saída
        output = io.StringIO()
        
        if format_type == 'csv':
            df_filtered.to_csv(output, index=False, sep=',')
            mimetype = 'text/csv'
            filename = f"dados_processados_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        elif format_type == 'excel':
            output = io.BytesIO()
            df_filtered.to_excel(output, index=False)
            mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            filename = f"dados_processados_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype=mimetype,
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return f"Erro ao exportar dados: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
